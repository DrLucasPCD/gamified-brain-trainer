// Manipula ações de autenticação e exibe o menu quando o usuário está logado

// Botões e elementos de interface
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const signOutBtn = document.getElementById('sign-out-btn');
let unsubProgress = null; // para parar o listener ao sair

// Renderiza a lista de progresso
function renderProgress(snapshot) {
  const progressList = document.getElementById('progress-list');
  progressList.innerHTML = '';
  if (!snapshot || snapshot.empty) {
    const li = document.createElement('li');
    li.textContent = 'Sem registros ainda — jogue um treino!';
    progressList.appendChild(li);
    return;
  }
  // Mapeia identificadores de jogos para nomes amigáveis
  const gameNameMap = {
    memory: 'Memória',
    speed: 'Raciocínio Rápido',
    puzzle: 'Quebra-cabeça',
    iq: 'Teste de QI'
  };
  snapshot.forEach(doc => {
    const data = doc.data() || {};
    const li = document.createElement('li');
    const name = gameNameMap[doc.id] || doc.id;
    let text;
    if (doc.id === 'iq' && data.total) {
      text = `${name}: ${data.score || 0}/${data.total}`;
    } else {
      const attempts = data.attempts || 0;
      const correct = data.correct || 0;
      text = `${name}: ${correct}/${attempts}`;
    }
    li.textContent = text;
    progressList.appendChild(li);
  });
}

// Ouvinte de mudança de autenticação
auth.onAuthStateChanged(user => {
  if (user) {
    // Usuário logado: mostra menu e oculta formulários de login/registro
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('user-container').classList.remove('hidden');
    document.getElementById('menu-container').classList.remove('hidden');
    document.getElementById('user-email').textContent = user.email;
    document.body.classList.add('logged-in');

    // Inicia listener em tempo real do progresso
    if (unsubProgress) unsubProgress();
    try {
      unsubProgress = db
        .collection('users').doc(user.uid)
        .collection('progress')
        .onSnapshot(renderProgress, (err) => {
          const list = document.getElementById('progress-list');
          list.innerHTML = '';
          const li = document.createElement('li');
          li.textContent = 'Não foi possível ler o progresso (permissão/rede).';
          list.appendChild(li);
          console.warn('Falha ao ler progresso:', err);
        });
    } catch (e) {
      console.warn('Snapshot progresso falhou:', e);
    }
  } else {
    // Usuário não logado: mostra formulários de login/registro
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('user-container').classList.add('hidden');
    document.getElementById('menu-container').classList.add('hidden');
    document.body.classList.remove('logged-in');
    if (unsubProgress) { unsubProgress(); unsubProgress = null; }
  }
});

// Funções de login e registro
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
});

registerBtn.addEventListener('click', () => {
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
});

// Função de logout
signOutBtn.addEventListener('click', () => {
  auth.signOut();
});