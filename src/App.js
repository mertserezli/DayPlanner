import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

import Calendar from './Calendar';

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
    <main style={{grow: 1, display: "flex", flexDirection: "row"}}>
        <aside style={{width: "45%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Calendar/>
        </aside>
        <article style={{flexGrow: "1"}}>
            <SignOut/>
            <TodoList/>
        </article>
    </main>
    )
}

function TodoList() {
    const query = firestore.collection('Todo');
    const [TodoItems] = useCollectionData(query,{ idField: 'id' });

    const [descriptionState, setDescriptionState] = useState('');

    if (TodoItems)
        TodoItems.sort((a,b)=> b.value / b.time - a.balue / a.time);

    return(
        <div style={{display: "flex", flexDirection: "row"}}>
            <div  style={{width: "35%"}}>
                <table>
                    <thead>
                    <tr>
                        <th>To Do</th>
                        <th>Score</th>
                        <th>Value</th>
                        <th>Time</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {TodoItems && TodoItems.map(item =>
                        <tr key={item.id} onClick={()=>setDescriptionState({description: item.description, id: item.id})}>
                            <td>{item.name}</td>
                            <td>{item.value / item.time}</td>
                            <td>{item.value}</td>
                            <td>{item.time}</td>
                            <td><button>delete</button></td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <AddTodo/>
            </div>
            <Description descriptionState={descriptionState} setDescriptionState={setDescriptionState}/>
        </div>
    )
}

function AddTodo(){
    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');

    const addTodo = async (e) => {
        e.preventDefault();
        const query = firestore.collection('Todo');

        await query.add({name:title, value:parseInt(value), time:parseInt(time), description:description});

        setTitle('');
        setValue('');
        setTime('');
        setDescription('');
    };

    return (
        <>
            <form style={{grow: 1, display: "flex", flexDirection: "column", flexWrap: "wrap"}}>
                <label htmlFor="title"><b>Title</b></label>
                <input placeholder="Title" name="title" id="title"
                       value={title} onChange={(e) => setTitle(e.target.value)}/>
                <label htmlFor="value"><b>Value</b></label>
                <input placeholder="INTRINSIC Value" type="number" name="value" id="value"
                       value={value} onChange={(e) => setValue(e.target.value)}/>
                <label htmlFor="time"><b>Time</b></label>
                <input placeholder="Time(minutes)" type="number" name="time" id="time"
                       value={time} onChange={(e) => setTime(e.target.value)}/>
                <label htmlFor="description"><b>Description</b></label>
                <textarea placeholder="Description" name="description" id="description"
                          value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit" onClick={addTodo}>Add</button>
            </form>
        </>
    )
}

function Description(props){
    const description = props.descriptionState.description;
    const curItemId = props.descriptionState.id;
    const setDescriptionState = props.setDescriptionState;

    const query = firestore.collection('Todo');

    const save = async ()=>{
        query.doc(curItemId).update({description:description})
    };

    return(
        <div>
            <textarea value={description} onChange={(e) => setDescriptionState({description: e.target.value, id: curItemId})}/>
            <button type="submit" onClick={()=>save()}>Save</button>
        </div>
    )
}

export default App;
