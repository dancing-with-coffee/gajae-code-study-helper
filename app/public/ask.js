// 질문하기 화면. 서버(/api/ask)가 한 줄씩 보내는 JSON을 받아 화면에 보여준다.
const form = document.getElementById("ask-form");
const input = document.getElementById("question");
const button = document.getElementById("ask-button");
const statusBox = document.getElementById("sdk-status");
const thread = document.getElementById("thread");
const asked = document.getElementById("asked");
const progress = document.getElementById("progress");
const answerBox = document.getElementById("answer");
const sourcesBox = document.getElementById("sources");
const typingHtml = '<div class="typing"><span></span><span></span><span></span></div>';

function setDisabled(reason) {
  button.disabled = true;
  statusBox.className = "status-pill warn";
  statusBox.innerHTML = "";
  const text = document.createElement("span");
  text.textContent = "질문하기를 지금은 쓸 수 없어요 (다른 화면은 정상입니다) · " + reason;
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "btn btn-secondary btn-sm";
  retry.textContent = "다시 확인";
  retry.onclick = () => checkStatus(true);
  statusBox.append(text, retry);
}

function setEnabled() {
  button.disabled = false;
  statusBox.className = "status-pill ok";
  statusBox.textContent = "가재코드 연결됨";
}

async function checkStatus(force) {
  statusBox.className = "status-pill";
  statusBox.textContent = "가재코드 연결을 확인하고 있어요...";
  try {
    const res = await fetch("/api/status" + (force ? "?force=1" : ""));
    const state = await res.json();
    state.ok ? setEnabled() : setDisabled(state.reason || "알 수 없는 이유");
  } catch (e) {
    setDisabled("서버에 연결할 수 없어요.");
  }
}

for (const chip of document.querySelectorAll(".chip")) {
  chip.addEventListener("click", () => {
    input.value = chip.dataset.q;
    input.focus();
  });
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) form.requestSubmit();
});

function renderSources(sources) {
  if (!sources.length) return;
  sourcesBox.hidden = false;
  sourcesBox.innerHTML = "<h4>근거 페이지</h4>";
  const list = document.createElement("div");
  list.className = "source-chips";
  for (const s of sources) {
    const a = document.createElement("a");
    a.className = "source-chip";
    a.href = s.href;
    a.innerHTML = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z"/><path d="M4 19V5"/></svg>';
    const span = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = s.title.replace(/\s*\(.*\)$/, "");
    const small = document.createElement("small");
    small.textContent = s.path;
    span.append(strong, small);
    a.append(span);
    list.append(a);
  }
  sourcesBox.append(list);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question || button.disabled) return;
  button.disabled = true;
  thread.hidden = false;
  asked.textContent = question;
  answerBox.innerHTML = typingHtml;
  answerBox.classList.remove("streaming");
  sourcesBox.hidden = true;
  progress.textContent = "질문을 보냈어요";
  thread.scrollIntoView({ behavior: "smooth", block: "start" });
  let raw = "";
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (!line.trim()) continue;
        const msg = JSON.parse(line);
        if (msg.type === "status") progress.textContent = msg.text;
        if (msg.type === "delta") {
          raw += msg.text;
          answerBox.classList.add("streaming");
          answerBox.textContent = raw;
        }
        if (msg.type === "error") {
          thread.hidden = true;
          setDisabled(msg.text);
          return;
        }
        if (msg.type === "done") {
          progress.textContent = "답변 완료";
          answerBox.classList.remove("streaming");
          answerBox.innerHTML = msg.html;
          renderSources(msg.sources);
        }
      }
    }
  } catch (e) {
    setDisabled("답을 받는 중 연결이 끊겼어요.");
    return;
  }
  button.disabled = false;
});

checkStatus(false);
