import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
    apiKey: "AIzaSyCKrEzZjqKJ_ttiodu4dhY_Pxicx8pMt6w",
    authDomain: "vault-ac7ea.firebaseapp.com",
    projectId: "vault-ac7ea",
    storageBucket: "vault-ac7ea.firebasestorage.app",
    messagingSenderId: "41052233986",
    appId: "1:41052233986:web:36023a50dd3ff8878ae21b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});