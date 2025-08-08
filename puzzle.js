// Quebra-cabeça com HUD, timer e dificuldade
let authPuzzle=null, dbPuzzle=null; try{ if(typeof firebase!=='undefined'){ if(!firebase.apps||!firebase.apps.length){ if(typeof firebaseConfig!=='undefined') firebase.initializeApp(firebaseConfig);} authPuzzle=firebase.auth(); dbPuzzle=firebase.firestore(); } }catch(e){console.warn('Firebase (puzzle) opcional:',e)}

const words=['neuronio','sinapse','cerebro','memoria','cognicao','logica','inteligencia','mente'];
let level=1, streak=0, score=0, timerId=null; const ANSWER_MS=15000; let currentWord='';
const el=id=>document.getElementById(id);

function pickWord(){ const pool=words.filter(w=>w.length<=5+level); return pool[Math.floor(Math.random()*pool.length)]||words[Math.floor(Math.random()*words.length)]; }
function scramble(w){ return w.split('').sort(()=>Math.random()-0.5).join(''); }
function startBar(ms){ clearInterval(timerId); const bar=el('puz-timer'); let start=Date.now(); bar.style.width='100%'; timerId=setInterval(()=>{ const p=1-((Date.now()-start)/ms); bar.style.width=Math.max(0,p*100)+"%"; if(p<=0){ clearInterval(timerId); fail('Tempo esgotado!'); } },30); }

function updateHUD(){ el('puz-streak').textContent=streak; el('puz-score').textContent=score; el('puz-level').textContent=level; }
function flash(ok){ const card=el('puz-card'); card.classList.remove('pulse','shake'); void card.offsetWidth; card.classList.add(ok?'pulse':'shake'); const fb=el('puzzle-feedback'); fb.className = ok? 'feedback-ok':'feedback-bad'; }

function save(correct){ if(!dbPuzzle||!authPuzzle) return; const u=authPuzzle.currentUser; if(!u) return; dbPuzzle.collection('users').doc(u.uid).collection('progress').doc('puzzle').set({ lastPlayed:new Date(), correct: firebase.firestore.FieldValue.increment(correct?1:0), attempts: firebase.firestore.FieldValue.increment(1) },{merge:true}).catch(()=>{}); }

function next(){ currentWord=pickWord(); el('scrambled-word').textContent=scramble(currentWord); el('puzzle-input').value=''; el('puzzle-feedback').textContent=''; updateHUD(); startBar(ANSWER_MS); }
function win(){ score+=10; streak++; if(streak%4===0) level++; save(true); next(); }
function fail(msg){ el('puzzle-feedback').textContent=msg||`Errado. Era "${currentWord}".`; flash(false); streak=0; if(level>1) level--; save(false); next(); }

document.addEventListener('DOMContentLoaded',()=>{
  next();
  el('submit-puzzle').addEventListener('click',()=>{
    clearInterval(timerId);
    const ans=el('puzzle-input').value.trim().toLowerCase();
    if(!ans){ startBar(ANSWER_MS); return; }
    if(ans===currentWord){ el('puzzle-feedback').textContent='Correto!'; flash(true); win(); }
    else { fail(); }
  });
});