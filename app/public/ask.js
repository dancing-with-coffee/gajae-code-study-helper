// 질문하기 화면. 서버(/api/ask)가 한 줄씩 보내는 JSON을 받아 화면에 보여준다.
const form = document.getElementById("ask-form");
const input = document.getElementById("question");
const button = document.getElementById("ask-button");
const statusBox = document.getElementById("sdk-status");
const progress = document.getElementById("progress");
const answerBox = document.getElementById("answer");
const sourcesBox = document.getElementById("sources");

function setDisabled(reason) {
  button.disabled = true;
  input.disabled = true;
  statusBox.className = "notice warn";
  statusBox.innerHTML = "";
  const text = document.createElement("div");
  text.textContent = "질문하기를 지금은 쓸 수 없어요. (다른 화면은 정상입니다) — " + reason;
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "ghost";
  retry.textContent = "다시 확인";
  retry.onclick = () => checkStatus(true);
  statusBox.append(text, retry);
}

function setEnabled() {
  button.disabled = false;
  input.disabled = false;
  statusBox.className = "notice ok";
  statusBox.textContent = "가재코드 연결됨. 질문을 입력하세요.";
}

async function checkStatus(force) {
  statusBox.className = "notice";
  statusBox.textContent = "가재코드 연결을 확인하고 있어요...";
  try {
    const res = await fetch("/api/status" + (force ? "?force=1" : ""));
    const state = await res.json();
    state.ok ? setEnabled() : setDisabled(state.reason || "알 수 없는 이유");
  } catch (e) {
    setDisabled("서버에 연결할 수 없어요.");
  }
}

document.getElementById("example-button").onclick = () => {
  input.value = "하네스와 모델은 어떻게 다른가요?";
  input.focus();
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question || button.disabled) return;
  button.disabled = true;
  answerBox.hidden = false;
  answerBox.textContent = "";
  sourcesBox.hidden = true;
  progress.textContent = "질문을 보냈어요...";
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
        if (msg.type === "status") progress.textContent = "🦞 " + msg.text;
        if (msg.type === "delta") { raw += msg.text; answerBox.textContent = raw; }
        if (msg.type === "error") { answerBox.hidden = true; progress.textContent = ""; setDisabled(msg.text); return; }
        if (msg.type === "done") {
          progress.textContent = "답변 완료";
          answerBox.innerHTML = msg.html;
          if (msg.sources.length) {
            sourcesBox.hidden = false;
            sourcesBox.innerHTML = "<h2>근거 페이지</h2>";
            const ul = document.createElement("ul");
            for (const s of msg.sources) {
              const li = document.createElement("li");
              const a = document.createElement("a");
              a.href = s.href; a.textContent = s.title + " (" + s.path + ")";
              li.append(a); ul.append(li);
            }
            sourcesBox.append(ul);
          }
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
