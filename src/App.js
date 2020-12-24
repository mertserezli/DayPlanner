import React, {useContext, useState} from 'react';
import './App.css';

import Calendar from './Calendar';
import PeriodicTodoList from './PeriodicTodoList'
import TodoList from "./TodoList";
import AuthProvider, {UserContext, auth} from "./AuthProvider"

import firebase from 'firebase/app';
import TaskFlow from "./TaskFlow";

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


function App() {
    return (
      <AuthProvider>
        <Application/>
      </AuthProvider>
    );
}

function Application() {
    const user = useContext(UserContext);
    return(
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
    const user = useContext(UserContext);
    const [isFlow, setIsFlow] = useState(false);

    return(
    <div className={"grid-container"}>
        <div className={"Calendar"}>
            <SignOut/>
            <Calendar user={user}/>
        </div>
        <div className={"Todolist"}>
            <button onClick={()=>setIsFlow(!isFlow)}>{isFlow ? "Stop Flow" : "Start Flow"}</button>
            {!isFlow ?
                <TodoList/>
                :
                <TaskFlow/>
            }
        </div>
        <div className={"Periodic"}>
            <PeriodicTodoList/>
        </div>
    </div>
    )
}

export default App;
