import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apikey: "AIzaSyCKrEzZjqKJ_ttiodu4dhY_Pxicx8pMt6w",
    authDomain: "vault-ac7ea.firebaseapp.com",
    projectId: "vault-ac7ea",
    storageBucket: "vault-ac7ea.firebasestorage.app",
    messagingSenderId: "41052233986",
    appId: "1:41052233986:web:36023a50dd3ff8878ae21b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);