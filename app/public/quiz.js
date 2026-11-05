// 퀴즈 화면. 보기를 누르면 정답 여부와 해설을 보여준다.
const questions = document.querySelectorAll(".quiz-q");
let answered = 0;
let correct = 0;
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
      feedback.textContent = ok ? "정답이에요! 🎉" : `아쉬워요. 정답은 ${answer}입니다.`;
      explanation.hidden = false;
      if (answered === questions.length) {
        const score = document.getElementById("score");
        score.hidden = false;
        score.textContent = `점수: ${correct} / ${questions.length}`;
      }
    });
  }
}
