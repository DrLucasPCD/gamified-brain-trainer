// Jogo de memória simples: exibe uma sequência e pede para o usuário digitar.

// Guardas para Firebase (o jogo funciona mesmo sem Firebase)
let authMem = null;
let dbMem = null;
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps || !firebase.apps.length) {
      if (typeof firebaseConfig !== 'undefined') firebase.initializeApp(firebaseConfig);
    }
    authMem = firebase.auth();
    dbMem   = firebase.firestore();
  }
} catch (e) {
  console.warn('Firebase não inicializado (memory):', e);
}

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
  setTimeout(() => { container.textContent = '…'; }, 3000);
}

function saveScore(correct) {
  if (!dbMem || !authMem) return;
  const user = authMem.currentUser;
  if (!user) return;
  dbMem.collection('users').doc(user.uid).collection('progress')
    .doc('memory').set({
      lastPlayed: new Date(),
      correct: firebase.firestore.FieldValue.increment(correct ? 1 : 0),
      attempts: firebase.firestore.FieldValue.increment(1)
    }, { merge: true }).catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
  generateSequence();
  showSequence();
  const feedbackEl = document.getElementById('memory-feedback');
  document.getElementById('submit-memory').addEventListener('click', () => {
    const raw = document.getElementById('memory-input').value.replace(/\s+/g, '').trim();
    if (!raw) {
      feedbackEl.textContent = 'Digite a sequência mostrada.';
      return;
    }
    const input = raw.split('').map(ch => parseInt(ch, 10));
    if (input.some(n => Number.isNaN(n))) {
      feedbackEl.textContent = 'Use apenas números.';
      return;
    }
    const correct = JSON.stringify(input) === JSON.stringify(sequence);
    feedbackEl.textContent = correct ? 'Correto! Parabéns.' : 'Errado. A sequência era: ' + sequence.join(' ');
    saveScore(correct);
    generateSequence();
    showSequence();
    document.getElementById('memory-input').value = '';
  });
});