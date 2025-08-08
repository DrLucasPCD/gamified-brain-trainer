// Memória com HUD, timer e dificuldade progressiva
let authMem=null, dbMem=null; try{ if(typeof firebase!=='undefined'){ if(!firebase.apps||!firebase.apps.length){ if(typeof firebaseConfig!=='undefined') firebase.initializeApp(firebaseConfig);} authMem=firebase.auth(); dbMem=firebase.firestore(); } }catch(e){console.warn('Firebase (memory) opcional:',e)}

let seqLength=4, streak=0, score=0, timerId=null; const ANSWER_MS=12000; let sequence=[];
const el = id=>document.getElementById(id);

function generateSequence(){ sequence=[]; for(let i=0;i<seqLength;i++){ sequence.push(Math.floor(Math.random()*10)); } }
function showSequence(){ const c=el('sequence-container'); c.textContent=sequence.join(' '); setTimeout(()=>{ c.textContent='…'; }, 2200); }

function startBar(ms, barId, onExpire){ clearInterval(timerId); const bar=el(barId); let start=Date.now(); bar.style.width='100%'; timerId=setInterval(()=>{ const p=1-((Date.now()-start)/ms); bar.style.width=Math.max(0, p*100)+"%"; if(p<=0){ clearInterval(timerId); onExpire&&onExpire(); } }, 30); }

function saveScore(correct){ if(!dbMem||!authMem) return; const u=authMem.currentUser; if(!u) return; dbMem.collection('users').doc(u.uid).collection('progress').doc('memory').set({ lastPlayed:new Date(), correct: firebase.firestore.FieldValue.increment(correct?1:0), attempts: firebase.firestore.FieldValue.increment(1) },{merge:true}).catch(()=>{}); }

function updateHUD(){ el('mem-streak').textContent=streak; el('mem-score').textContent=score; el('mem-level').textContent=Math.max(1, seqLength-3); }
function flash(ok){ const card=el('mem-card'); card.classList.remove('pulse','shake'); void card.offsetWidth; card.classList.add(ok?'pulse':'shake'); const fb=el('memory-feedback'); fb.className= ok? 'feedback-ok':'feedback-bad'; }

function newRound(){ generateSequence(); showSequence(); updateHUD(); startBar(ANSWER_MS,'mem-timer', ()=>{ const fb=el('memory-feedback'); fb.textContent='Tempo esgotado!'; flash(false); streak=0; if(seqLength>4) seqLength--; updateHUD(); newRound(); }); }

document.addEventListener('DOMContentLoaded',()=>{
  newRound();
  el('submit-memory').addEventListener('click',()=>{
    clearInterval(timerId);
    const raw = el('memory-input').value.replace(/\s+/g,'').trim();
    const fb = el('memory-feedback');
    if(!raw){ fb.textContent='Digite a sequência.'; return; }
    const input = raw.split('').map(n=>parseInt(n,10));
    if(input.some(n=>Number.isNaN(n))){ fb.textContent='Use apenas números.'; return; }
    const ok = JSON.stringify(input)===JSON.stringify(sequence);
    fb.textContent = ok? 'Correto!': 'Errado. Era: '+sequence.join(' ');
    flash(ok);
    if(ok){ score+=10; streak++; if(streak%3===0 && seqLength<12) seqLength++; }
    else { streak=0; if(seqLength>4) seqLength--; }
    saveScore(ok); updateHUD(); el('memory-input').value=''; newRound();
  });
});