// Jogo de memória simples: exibe uma sequência de números e pede para o usuário digitar.
const authMem = firebase.auth();
const dbMem = firebase.firestore();
let sequence = [];

function generateSequence(length = 5) {
  sequence = [];
  for (let i = 0; i < length; i++) {
    sequence.push(Math.floor(Math.random() * 10));
  }
}

function showSequence() {
  const container = document.getElementById('sequence-container');
  container.textContent = sequence.join(' ');
  // Oculta a sequência após 3 segundos
  setTimeout(() => {
    container.textContent = '…';
  }, 3000);
}

function saveScore(correct) {
  const user = authMem.currentUser;
  if (!user) return;
  // Atualiza o progresso na coleção progress/memory
  dbMem.collection('users').doc(user.uid).collection('progress')
    .doc('memory').set({
      lastPlayed: new Date(),
      correct: firebase.firestore.FieldValue.increment(correct ? 1 : 0),
      attempts: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });
}

document.addEventListener('DOMContentLoaded', () => {
  generateSequence();
  showSequence();
  document.getElementById('submit-memory').addEventListener('click', () => {
    const input = document.getElementById('memory-input').value.trim().split('').map(ch => parseInt(ch, 10));
    const correct = JSON.stringify(input) === JSON.stringify(sequence);
    const feedback = document.getElementById('memory-feedback');
    if (correct) {
      feedback.textContent = 'Correto! Parabéns.';
    } else {
      feedback.textContent = 'Errado. A sequência era: ' + sequence.join(' ');
    }
    saveScore(correct);
    generateSequence();
    showSequence();
    document.getElementById('memory-input').value = '';
  });
});