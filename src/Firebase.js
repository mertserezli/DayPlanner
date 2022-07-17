import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import {
    getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAR3BhiHFJEAgb-DjNF4UJqKyK3tg-TndI",
    authDomain: "dayplanner-f78c2.firebaseapp.com",
    databaseURL: "https://dayplanner-f78c2.firebaseio.com",
    projectId: "dayplanner-f78c2",
    storageBucket: "dayplanner-f78c2.appspot.com",
    messagingSenderId: "626321664189",
    appId: "1:626321664189:web:aed04b2f38bc2c7100efd4",
    measurementId: "G-DF7GXSKEK8"
};

export const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);
export const auth = getAuth(firebase);
