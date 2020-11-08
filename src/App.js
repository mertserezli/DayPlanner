import React, { useState, useEffect, useCallback } from 'react';
import './App.css';


import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

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

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
      <div className="App">
        <h1 style={{textAlign:"center"}}>Day Planner</h1>

        <section>
          {user ? <DayPlanner /> : <SignIn />}
        </section>
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
    <>
        <div style={{display: "flex", flexDirection: "column"}}>
            <main style={{grow: 1, display: "flex", flexDirection: "row"}}>
                <aside style={{width: "35%"}}>
                    <SignOut/>
                    <Calendar/>
                </aside>
                <article style={{flexGrow: "1"}}>
                    <TodoList/>
                </article>
            </main>
        </div>
    </>
    )
}

function TodoList() {
    const query = firestore.collection('Todo');
    const [TodoItems] = useCollectionData(query,{ idField: 'id' });

    if (TodoItems)
        TodoItems.sort((a,b)=> b.Value / b.Time - a.Value / a.Time);

    return(
        <>
            <table>
                <thead>
                <tr>
                    <th>To Do</th>
                    <th>Score</th>
                    <th>Value</th>
                    <th>Time</th>
                </tr>
                </thead>
                <tbody>
                {TodoItems && TodoItems.map(item =>
                    <tr key={item.id}>
                        <td>{item.Name}</td>
                        <td>{item.Value / item.Time}</td>
                        <td>{item.Value}</td>
                        <td>{item.Time}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    )
}

export default App;
