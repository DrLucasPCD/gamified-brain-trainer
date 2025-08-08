// Jogo de raciocínio rápido: apresenta operações matemáticas simples
const authSpeed = firebase.auth();
const dbSpeed = firebase.firestore();
let currentProblem = { a: 0, b: 0, op: '+' };

function generateProblem() {
  const ops = ['+', '-', '*'];
  currentProblem.a = Math.floor(Math.random() * 10) + 1;
  currentProblem.b = Math.floor(Math.random() * 10) + 1;
  currentProblem.op = ops[Math.floor(Math.random() * ops.length)];
  document.getElementById('problem-container').textContent = `${currentProblem.a} ${currentProblem.op} ${currentProblem.b} = ?`;
}

function checkAnswer(answer) {
  let correctAnswer;
  switch (currentProblem.op) {
    case '+': correctAnswer = currentProblem.a + currentProblem.b; break;
    case '-': correctAnswer = currentProblem.a - currentProblem.b; break;
    case '*': correctAnswer = currentProblem.a * currentProblem.b; break;
  }
  return answer === correctAnswer;
}

function saveSpeedScore(correct) {
  const user = authSpeed.currentUser;
  if (!user) return;
  dbSpeed.collection('users').doc(user.uid).collection('progress')
    .doc('speed').set({
      lastPlayed: new Date(),
      correct: firebase.firestore.FieldValue.increment(correct ? 1 : 0),
      attempts: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });
}

document.addEventListener('DOMContentLoaded', () => {
  generateProblem();
  document.getElementById('submit-speed').addEventListener('click', () => {
    const answer = parseInt(document.getElementById('speed-input').value);
    const correct = checkAnswer(answer);
    const feedback = document.getElementById('speed-feedback');
    if (correct) {
      feedback.textContent = 'Correto!';
    } else {
      let correctAnswer;
      switch (currentProblem.op) {
        case '+': correctAnswer = currentProblem.a + currentProblem.b; break;
        case '-': correctAnswer = currentProblem.a - currentProblem.b; break;
        case '*': correctAnswer = currentProblem.a * currentProblem.b; break;
      }
      feedback.textContent = `Errado. A resposta correta é ${correctAnswer}.`;
    }
    saveSpeedScore(correct);
    generateProblem();
    document.getElementById('speed-input').value = '';
  });
});