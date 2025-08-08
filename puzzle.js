// Jogo de quebra‑cabeça de palavras: desembaralhe a palavra
const authPuzzle = firebase.auth();
const dbPuzzle = firebase.firestore();
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
  const user = authPuzzle.currentUser;
  if (!user) return;
  dbPuzzle.collection('users').doc(user.uid).collection('progress')
    .doc('puzzle').set({
      lastPlayed: new Date(),
      correct: firebase.firestore.FieldValue.increment(correct ? 1 : 0),
      attempts: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });
}

document.addEventListener('DOMContentLoaded', () => {
  newPuzzle();
  document.getElementById('submit-puzzle').addEventListener('click', () => {
    const answer = document.getElementById('puzzle-input').value.trim().toLowerCase();
    const correct = answer === currentWord;
    const feedback = document.getElementById('puzzle-feedback');
    if (correct) {
      feedback.textContent = 'Correto!';
    } else {
      feedback.textContent = `Errado. A palavra correta era ${currentWord}.`;
    }
    savePuzzleScore(correct);
    newPuzzle();
    document.getElementById('puzzle-input').value = '';
  });
});