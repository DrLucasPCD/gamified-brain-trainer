// Teste de QI simples com perguntas de múltipla escolha
const authIQ = firebase.auth();
const dbIQ = firebase.firestore();
const questions = [
  {
    question: 'Qual número completa a sequência: 2, 4, 8, 16, ___?',
    answers: ['18', '24', '32', '20'],
    correct: 2
  },
  {
    question: 'Se todos os bloops são razzies e todos os razzies são lazzies, todos os bloops são lazzies?',
    answers: ['Sim', 'Não', 'Depende', 'Nenhuma das anteriores'],
    correct: 0
  },
  {
    question: 'Qual figura tem quatro lados iguais e quatro ângulos retos?',
    answers: ['Retângulo', 'Trapézio', 'Quadrado', 'Paralelogramo'],
    correct: 2
  },
  {
    question: 'O que é mais pesado, um quilo de chumbo ou um quilo de algodão?',
    answers: ['Chumbo', 'Algodão', 'Os dois pesam o mesmo', 'Nenhum'],
    correct: 2
  }
];
let currentIndex = 0;
let score = 0;

function displayQuestion() {
  const q = questions[currentIndex];
  document.getElementById('question-container').textContent = q.question;
  const ansContainer = document.getElementById('answers-container');
  ansContainer.innerHTML = '';
  q.answers.forEach((ans, index) => {
    const btn = document.createElement('button');
    btn.textContent = ans;
    btn.addEventListener('click', () => selectAnswer(index));
    ansContainer.appendChild(btn);
  });
  document.getElementById('iq-feedback').textContent = '';
}

function selectAnswer(index) {
  const q = questions[currentIndex];
  const feedback = document.getElementById('iq-feedback');
  if (index === q.correct) {
    feedback.textContent = 'Correto!';
    score++;
  } else {
    feedback.textContent = `Errado. A resposta correta é "${q.answers[q.correct]}".`;
  }
  // Desativa os botões após a escolha
  const buttons = document.getElementById('answers-container').querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);
}

function saveIQScore() {
  const user = authIQ.currentUser;
  if (!user) return;
  dbIQ.collection('users').doc(user.uid).collection('progress')
    .doc('iq').set({
      lastPlayed: new Date(),
      score: score,
      total: questions.length
    }, { merge: true });
}

document.addEventListener('DOMContentLoaded', () => {
  displayQuestion();
  document.getElementById('next-question').addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      displayQuestion();
    } else {
      // Fim do teste
      document.getElementById('question-container').textContent = `Fim do teste! Sua pontuação: ${score}/${questions.length}`;
      document.getElementById('answers-container').innerHTML = '';
      document.getElementById('next-question').style.display = 'none';
      document.getElementById('iq-feedback').textContent = '';
      saveIQScore();
    }
  });
});