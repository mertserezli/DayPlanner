import React from 'react';
import './App.css';

import Calendar from './Calendar';
import PeriodicTodoList from './PeriodicTodoList'
import TodoList from "./TodoList";

import firebase from 'firebase/app';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyAR3BhiHFJEAgb-DjNF4UJqKyK3tg-TndI",
        authDomain: "dayplanner-f78c2.firebaseapp.com",
        databaseURL: "https://dayplanner-f78c2.firebaseio.com",
        projectId: "dayplanner-f78c2",
        storageBucket: "dayplanner-f78c2.appspot.com",
        messagingSenderId: "626321664189",
        appId: "1:626321664189:web:aed04b2f38bc2c7100efd4",
        measurementId: "G-DF7GXSKEK8"
    });
}

const auth = firebase.auth();

function App() {

  const [user] = useAuthState(auth);

  return (
      <div className="App">
        <h1 style={{textAlign:"center"}}>Day Planner</h1>
          {user ? <DayPlanner /> : <SignIn />}
      </div>
  );
}

function SignIn() {

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };

    return (
        <div style={{textAlign:"center"}}>
            <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    )

}

function SignOut() {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function DayPlanner() {
    return(
    <div className={"grid-container"}>
        <div className={"Calendar"}>
            <SignOut/>
            <Calendar/>
        </div>
        <div className={"Todolist"}>
            <TodoList/>
        </div>
        <div className={"Periodic"}>
            <PeriodicTodoList/>
        </div>
    </div>
    )
}

export default App;
