import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB3KulR1xw0q-aQYqPmW3sCCHXLuw7pVlI", // ¡Asegúrate de que esta API Key sea la correcta para tu proyecto!
  authDomain: "sig-moto.firebaseapp.com",
  projectId: "sig-moto",
  storageBucket: "sig-moto.firebasestorage.app",
  messagingSenderId: "1023917417778",
  appId: "1:1023917417778:web:e119d9caa66d93d470232b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  getDocs 
};
