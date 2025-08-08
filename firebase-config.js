// Firebase configuration
//
// Substitua os valores abaixo pelas chaves do seu projeto Firebase.
// Você pode encontrar esses valores no painel de configurações do seu projeto
// (Configurações > Geral > Seus aplicativos). Sem essas chaves, o aplicativo
// não conseguirá se conectar ao Firebase. Mantenha esta informação segura.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();