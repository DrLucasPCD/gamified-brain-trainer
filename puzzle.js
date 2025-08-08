// Quebra-cabeça de palavras: desembaralhe a palavra.

// Guardas para Firebase
let authPuzzle = null;
let dbPuzzle = null;
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps || !firebase.apps.length) {
      if (typeof firebaseConfig !== 'undefined') firebase.initializeApp(firebaseConfig);
    }
    authPuzzle = firebase.auth();
    dbPuzzle   = firebase.firestore();
  }
} catch (e) {
  console.warn('Firebase não inicializado (puzzle):', e);
}

const words = ['neuronio', 'sinapse', 'cerebro', 'memoria', 'cognicao', 'logica', 'inteligencia', 'mente'];
let currentWord = '';

function scramble(word) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

function newPuzzle() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  document.getElementById('scrambled-word').textContent = scramble(currentWord);
}

function savePuzzleScore(correct) {
  if (!dbPuzzle || !authPuzzle) return;
  const user = authPuzzle.currentUser;
  if (!user) return;
  dbPuzzle.collection('users').doc(user.uid).collection('progress')
    .doc('puzzle').set({
      lastPlayed: new Date(),
      correct: firebase.firestore.FieldValue.increment(correct ? 1 : 0),
      attempts: firebase.firestore.FieldValue.increment(1)
    }, { merge: true }).catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
  newPuzzle();
  document.getElementById('submit-puzzle').addEventListener('click', () => {
    const answer = document.getElementById('puzzle-input').value.trim().toLowerCase();
    const feedback = document.getElementById('puzzle-feedback');
    const correct = answer === currentWord;
    feedback.textContent = correct ? 'Correto!' : `Errado. A palavra correta era ${currentWord}.`;
    savePuzzleScore(correct);
    newPuzzle();
    document.getElementById('puzzle-input').value = '';
  });
});