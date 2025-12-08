import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);
export const auth = getAuth(firebase);

if (location.hostname === 'localhost') {
  console.log('localhost detected!');
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(firebase);
}

export { analytics };

export function getTodoListQuery() {
  return collection(firestore, 'Users', auth.currentUser.uid, 'Todo');
}

export function removeTodoItem(id) {
  deleteDoc(doc(getTodoListQuery(), id));
}

export function updateTodoItem(id, title, value, time, description) {
  updateDoc(doc(getTodoListQuery(), id), {
    name: title,
    value: parseInt(value),
    time: parseInt(time),
    description: description,
  });
}

export function updateTodoDescription(id, description) {
  updateDoc(doc(getTodoListQuery(), id), { description: description });
}

export function addTodoItem(title, value, time, description) {
  if (analytics) {
    logEvent(analytics, 'todo_add', {
      id: 'new',
      name: title,
      value: value,
      time: time,
      description: description,
    });
  }

  addDoc(getTodoListQuery(), {
    name: title,
    value: parseInt(value),
    time: parseInt(time),
    description: description,
  });
}

export function getPeriodicTodoListQuery() {
  return collection(firestore, 'Users', auth.currentUser.uid, 'PeriodicTodo');
}

export function removePeriodicTodoItem(id) {
  deleteDoc(doc(getPeriodicTodoListQuery(), id));
}

export function updatePeriodicTodoItem(id, title, period, description) {
  updateDoc(doc(getPeriodicTodoListQuery(), id), {
    name: title,
    period: period,
    description: description,
  });
}

export function updatePeriodicTodoDescriptionItem(id, description) {
  updateDoc(doc(getPeriodicTodoListQuery(), id), { description: description });
}

export function addPeriodicTodoItem(title, period, description) {
  addDoc(getPeriodicTodoListQuery(), { name: title, period: period, description: description });
}

export function getCalendarItemsQuery() {
  return collection(firestore, 'Users', auth.currentUser.uid, 'Calendar');
}

export function removeCalendarItem(id) {
  deleteDoc(doc(getCalendarItemsQuery(), id));
}

export function updateCalendarItem(changed) {
  Object.keys(changed).forEach((id) => {
    const docRef = doc(firestore, 'Users', auth.currentUser.uid, 'Calendar', id);
    updateDoc(docRef, changed[id]);
  });
}

export function addCalendarItem(added) {
  addDoc(getCalendarItemsQuery(), added);
}
