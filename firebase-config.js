// Firebase configuration
//
// Substitua os valores abaixo pelas chaves do seu projeto Firebase.
// Você pode encontrar esses valores no painel de configurações do seu projeto
// (Configurações > Geral > Seus aplicativos). Sem essas chaves, o aplicativo
// não conseguirá se conectar ao Firebase. Mantenha esta informação segura.
const firebaseConfig = {
 apiKey: "AIzaSyBFgj-7t_ALpE3QJ2h8ayMTCsSNd21PHDw",
    authDomain: "treinador-de-mente.firebaseapp.com",
    projectId: "treinador-de-mente",
    storageBucket: "treinador-de-mente.firebasestorage.app",
    messagingSenderId: "554570882942",
    appId: "1:554570882942:web:f9a0803b9bfe187c79dd2f",
    measurementId: "G-7EZBVP5H4K"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();