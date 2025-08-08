// Raciocínio rápido com HUD, timer e dificuldade progressiva
let authSpeed=null, dbSpeed=null; try{ if(typeof firebase!=='undefined'){ if(!firebase.apps||!firebase.apps.length){ if(typeof firebaseConfig!=='undefined') firebase.initializeApp(firebaseConfig);} authSpeed=firebase.auth(); dbSpeed=firebase.firestore(); } }catch(e){console.warn('Firebase (speed) opcional:',e)}

let streak=0, score=0, level=1, timerId=null; const ANSWER_MS=10000; let currentProblem={a:0,b:0,op:'+'};
const el=id=>document.getElementById(id);

function rangeByLevel(){ return 10 + (level-1)*10; }
function generateProblem(){ const ops=['+','-','*']; const max=rangeByLevel(); currentProblem.a=Math.floor(Math.random()*max)+1; currentProblem.b=Math.floor(Math.random()*max)+1; currentProblem.op=ops[Math.floor(Math.random()*ops.length)]; el('problem-container').textContent=`${currentProblem.a} ${currentProblem.op} ${currentProblem.b} = ?`; }
function correctAnswer(){ switch(currentProblem.op){ case '+':return currentProblem.a+currentProblem.b; case '-':return currentProblem.a-currentProblem.b; case '*':return currentProblem.a*currentProblem.b; } }

function startBar(ms){ clearInterval(timerId); const bar=el('speed-timer'); let start=Date.now(); bar.style.width='100%'; timerId=setInterval(()=>{ const p=1-((Date.now()-start)/ms); bar.style.width=Math.max(0,p*100)+"%"; if(p<=0){ clearInterval(timerId); miss('Tempo esgotado!'); } },30); }

function updateHUD(){ el('speed-streak').textContent=streak; el('speed-score').textContent=score; el('speed-level').textContent=level; }
function flash(ok){ const card=el('speed-card'); card.classList.remove('pulse','shake'); void card.offsetWidth; card.classList.add(ok?'pulse':'shake'); const fb=el('speed-feedback'); fb.className = ok? 'feedback-ok':'feedback-bad'; }

function hit(){ score+=10; streak++; if(streak%4===0) level++; next(); }
function miss(msg){ const fb=el('speed-feedback'); fb.textContent=msg||`Errado. Correta: ${correctAnswer()}`; flash(false); streak=0; if(level>1) level--; next(); }

function next(){ updateHUD(); generateProblem(); startBar(ANSWER_MS); el('speed-input').value=''; el('speed-feedback').textContent=''; }

document.addEventListener('DOMContentLoaded',()=>{
  next();
  el('submit-speed').addEventListener('click',()=>{
    clearInterval(timerId);
    const val=parseInt(el('speed-input').value,10);
    if(Number.isNaN(val)){ el('speed-feedback').textContent='Digite um número válido.'; startBar(ANSWER_MS); return; }
    const ok = val===correctAnswer();
    if(ok){ el('speed-feedback').textContent='Correto!'; flash(true); hit(); }
    else { miss(); }
  });
});