// 퀴즈 화면. 보기를 누르면 정답 여부와 해설을 보여주고, 진행 막대와 점수를 갱신한다.
const questions = [...document.querySelectorAll(".quiz-q")];
const barFill = document.getElementById("bar-fill");
const progressLabel = document.getElementById("progress-label");
const scoreBox = document.getElementById("score");
let answered = 0;
let correct = 0;

function updateProgress() {
  barFill.style.width = `${(answered / questions.length) * 100}%`;
  progressLabel.textContent = `${answered} / ${questions.length}`;
}

function showScore() {
  const ratio = correct / questions.length;
  const message = ratio === 1 ? "완벽해요! 이 개념은 확실히 이해했어요." : ratio >= 0.5 ? "좋아요! 틀린 문제의 해설을 한 번 더 읽어 보세요." : "개념 페이지를 먼저 읽고 다시 풀어 보세요.";
  scoreBox.hidden = false;
  scoreBox.innerHTML = "";
  const score = document.createElement("div");
  score.className = "score";
  score.textContent = `${correct} / ${questions.length}`;
  const p = document.createElement("p");
  p.textContent = message;
  const actions = document.createElement("div");
  actions.className = "actions";
  const retry = document.createElement("button");
  retry.className = "btn btn-primary";
  retry.textContent = "다시 풀기";
  retry.onclick = () => location.reload();
  const list = document.createElement("a");
  list.className = "btn btn-secondary";
  list.href = "/quiz";
  list.textContent = "다른 퀴즈";
  actions.append(retry, list);
  scoreBox.append(score, p, actions);
  scoreBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

for (const q of questions) {
  const answer = q.dataset.answer;
  const feedback = q.querySelector(".feedback");
  const explanation = q.querySelector(".explanation");
  for (const option of q.querySelectorAll(".option")) {
    option.addEventListener("click", () => {
      if (q.dataset.done) return;
      q.dataset.done = "1";
      answered += 1;
      const ok = option.dataset.key === answer;
      if (ok) correct += 1;
      option.classList.add(ok ? "right" : "wrong");
      q.querySelector(`.option[data-key="${answer}"]`).classList.add("right");
      feedback.hidden = false;
      feedback.className = `feedback ${ok ? "good" : "bad"}`;
      feedback.textContent = ok ? "정답이에요" : `아쉬워요 · 정답은 ${answer}`;
      explanation.hidden = false;
      updateProgress();
      if (answered === questions.length) showScore();
    });
  }
}
updateProgress();
