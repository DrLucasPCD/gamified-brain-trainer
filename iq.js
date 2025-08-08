// IQ com progresso visual
let authIQ=null, dbIQ=null; try{ if(typeof firebase!=='undefined'){ if(!firebase.apps||!firebase.apps.length){ if(typeof firebaseConfig!=='undefined') firebase.initializeApp(firebaseConfig);} authIQ=firebase.auth(); dbIQ=firebase.firestore(); } }catch(e){console.warn('Firebase (iq) opcional:',e)}

const questions=[
  {question:'Qual número completa a sequência: 2, 4, 8, 16, ___?', answers:['18','24','32','20'], correct:2},
  {question:'Se todos os bloops são razzies e todos os razzies são lazzies, todos os bloops são lazzies?', answers:['Sim','Não','Depende','Nenhuma das anteriores'], correct:0},
  {question:'Qual figura tem quatro lados iguais e quatro ângulos retos?', answers:['Retângulo','Trapézio','Quadrado','Paralelogramo'], correct:2},
  {question:'O que é mais pesado, um quilo de chumbo ou um quilo de algodão?', answers:['Chumbo','Algodão','Os dois pesam o mesmo','Nenhum'], correct:2}
];
let currentIndex=0, score=0;
const el=id=>document.getElementById(id);

function setProgress(){ const total=questions.length; const n=currentIndex+1; el('iq-progress-text').textContent=`${n} / ${total}`; const bar=el('iq-progress-bar'); bar.style.width=(n/total*100)+'%'; }

function displayQuestion(){ const q=questions[currentIndex]; el('question-container').textContent=q.question; const cont=el('answers-container'); cont.innerHTML=''; q.answers.forEach((ans,i)=>{ const b=document.createElement('button'); b.textContent=ans; b.addEventListener('click',()=>selectAnswer(i)); cont.appendChild(b); }); el('iq-feedback').textContent=''; setProgress(); }

function selectAnswer(i){ const q=questions[currentIndex]; const fb=el('iq-feedback'); if(i===q.correct){ fb.textContent='Correto!'; fb.className='feedback-ok'; score++; el('iq-card').classList.add('pulse'); setTimeout(()=>el('iq-card').classList.remove('pulse'),400); } else { fb.textContent=`Errado. Correto: \"${q.answers[q.correct]}\".`; fb.className='feedback-bad'; el('iq-card').classList.add('shake'); setTimeout(()=>el('iq-card').classList.remove('shake'),350); } const btns=el('answers-container').querySelectorAll('button'); btns.forEach(b=>b.disabled=true); }

function saveIQScore(){ if(!dbIQ||!authIQ) return; const u=authIQ.currentUser; if(!u) return; dbIQ.collection('users').doc(u.uid).collection('progress').doc('iq').set({ lastPlayed:new Date(), score, total:questions.length },{merge:true}).catch(()=>{}); }

document.addEventListener('DOMContentLoaded',()=>{
  displayQuestion();
  el('next-question').addEventListener('click',()=>{
    if(currentIndex<questions.length-1){ currentIndex++; displayQuestion(); }
    else {
      el('question-container').textContent=`Fim do teste! Sua pontuação: ${score}/${questions.length}`;
      el('answers-container').innerHTML=''; el('next-question').style.display='none'; el('iq-feedback').textContent=''; setProgress(); saveIQScore();
    }
  });
});