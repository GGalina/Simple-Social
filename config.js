// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from 'firebase/app';
// Функція для підключення авторизації в проект
import { getAuth } from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyDkuVSh5JT3C8wcaOWNTAh07qideQWTnj0",

  authDomain: "react-native-6baf0.firebaseapp.com",

  projectId: "react-native-6baf0",

  storageBucket: "react-native-6baf0.appspot.com",

  messagingSenderId: "38996528899",

  appId: "1:38996528899:web:a0de598a2cee7590dd2336"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);