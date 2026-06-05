
// 1. Importaciones usando CDN oficiales (necesarias para producción en GitHub Pages sin empaquetadores)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  onValue 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 2. Tu configuración oficial de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB3KulR1xw0q-aQYqPmW3sCCHXLuw7pVlI", 
  authDomain: "sig-moto.firebaseapp.com",
  // Agregamos la URL exacta de tu Realtime Database
  databaseURL: "https://sig-moto-default-rtdb.firebaseio.com", 
  projectId: "sig-moto",
  storageBucket: "sig-moto.firebasestorage.app",
  messagingSenderId: "1023917417778",
  appId: "1:1023917417778:web:e119d9caa66d93d470232b"
};

// 3. Inicialización de la App
const app = initializeApp(firebaseConfig);

// 4. Inicialización y Exportación de Servicios y Funciones
export const auth = getAuth(app);
export const db = getDatabase(app); // Ahora 'db' apunta a tu Realtime Database

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  ref, 
  push, 
  set, 
  onValue 
};