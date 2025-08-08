// Manipula ações de autenticação e exibe o menu quando o usuário está logado

// Botões e elementos de interface
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const signOutBtn = document.getElementById('sign-out-btn');

// Função para atualizar a lista de progresso do usuário
function updateProgress() {
  const user = auth.currentUser;
  if (!user) return;
  const progressList = document.getElementById('progress-list');
  progressList.innerHTML = '';
  // Busca dados de progresso na coleção "progress" do usuário
  db.collection('users').doc(user.uid).collection('progress').get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement('li');
      // Mapeia identificadores de jogos para nomes amigáveis
      const gameNameMap = {
        memory: 'Memória',
        speed: 'Raciocínio Rápido',
        puzzle: 'Quebra-cabeça',
        iq: 'Teste de QI'
      };
      const name = gameNameMap[doc.id] || doc.id;
      // Constrói texto de progresso com base nos campos disponíveis
      let text;
      if (doc.id === 'iq' && data.total) {
        text = `${name}: ${data.score || 0}/${data.total}`;
      } else {
        text = `${name}: ${data.correct || 0}/${data.attempts || 0}`;
      }
      li.textContent = text;
      progressList.appendChild(li);
    });
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
    updateProgress();
  } else {
    // Usuário não logado: mostra formulários de login/registro
    document.getElementById('auth-container').classList.remove('hidden');
    document.getElementById('user-container').classList.add('hidden');
    document.getElementById('menu-container').classList.add('hidden');
  }
});

// Funções de login e registro
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
});

registerBtn.addEventListener('click', () => {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
});

// Função de logout
signOutBtn.addEventListener('click', () => {
  auth.signOut();
});