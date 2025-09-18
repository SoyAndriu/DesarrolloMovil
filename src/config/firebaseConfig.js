import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC17aHU0v7hDCQnpjX1Do1749HiPVQWGkw",
  authDomain: "mobilestart-95723.firebaseapp.com",
  projectId: "mobilestart-95723",
  storageBucket: "mobilestart-95723.firebasestorage.app",
  messagingSenderId: "432743317943",
  appId: "1:432743317943:web:8067800edc0629ddd6e832",
  measurementId: "G-R03GFR34X3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
