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
  apiKey: 'AIzaSyAR3BhiHFJEAgb-DjNF4UJqKyK3tg-TndI',
  authDomain: 'dayplanner-f78c2.firebaseapp.com',
  databaseURL: 'https://dayplanner-f78c2.firebaseio.com',
  projectId: 'dayplanner-f78c2',
  storageBucket: 'dayplanner-f78c2.appspot.com',
  messagingSenderId: '626321664189',
  appId: '1:626321664189:web:aed04b2f38bc2c7100efd4',
  measurementId: 'G-DF7GXSKEK8',
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

export function updatePeriodicTodoItem(id, title, period) {
  updateDoc(doc(getPeriodicTodoListQuery(), id), { name: title, period: period });
}

export function updatePeriodicTodoDescriptionItem(id, description) {
  updateDoc(doc(getPeriodicTodoListQuery(), id), { description: description });
}

export function addPeriodicTodoItem(title, period, description) {
  addDoc(getPeriodicTodoListQuery(), { name: title, period: period, description: description });
}

export function getCalendarItemsQuery() {
  return doc(firestore, 'Users', auth.currentUser.uid, 'Calendar', 'date');
}
