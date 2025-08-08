// Jogo de raciocínio rápido: operações simples em velocidade.

// Guardas para Firebase
let authSpeed = null;
let dbSpeed = null;
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps || !firebase.apps.length) {
      if (typeof firebaseConfig !== 'undefined') firebase.initializeApp(firebaseConfig);
    }
    authSpeed = firebase.auth();
    dbSpeed   = firebase.firestore();
  }
} catch (e) {
  console.warn('Firebase não inicializado (speed):', e);
}

let currentProblem = { a: 0, b: 0, op: '+' };

function generateProblem() {
  const ops = ['+', '-', '*'];
  currentProblem.a = Math.floor(Math.random() * 10) + 1;
  currentProblem.b = Math.floor(Math.random() * 10) + 1;
  currentProblem.op = ops[Math.floor(Math.random() * ops.length)];
  document.getElementById('problem-container').textContent =
    `${currentProblem.a} ${currentProblem.op} ${currentProblem.b} = ?`;
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
  if (!dbSpeed || !authSpeed) return;
  const user = authSpeed.currentUser;
  if (!user) return;
  dbSpeed.collection('users').doc(user.uid).collection('progress')
    .doc('speed').set({
      lastPlayed: new Date(),
      correct: firebase.firestore.FieldValue.increment(correct ? 1 : 0),
      attempts: firebase.firestore.FieldValue.increment(1)
    }, { merge: true }).catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
  generateProblem();
  document.getElementById('submit-speed').addEventListener('click', () => {
    const inputEl = document.getElementById('speed-input');
    const feedback = document.getElementById('speed-feedback');
    const answer = parseInt(inputEl.value, 10);
    if (Number.isNaN(answer)) {
      feedback.textContent = 'Digite um número válido.';
      return;
    }
    const correct = checkAnswer(answer);
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
    inputEl.value = '';
  });
});