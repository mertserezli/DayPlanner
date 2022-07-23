import React, {useState} from 'react';
import './App.css';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import Calendar from './Calendar';
import PeriodicTodoList from './PeriodicTodoList'
import TodoList from "./TodoList";
import AuthProvider, {useUserStore} from "./AuthProvider";
import {auth} from "./Firebase";

import TaskFlow from "./TaskFlow";

function App() {
    return (
      <AuthProvider>
        <Application/>
      </AuthProvider>
    );
}

function Application() {
    const user = useUserStore();
    return(
        <div className="App">
            <h1 style={{textAlign:"center"}}>Day Planner</h1>
            {user ? <DayPlanner /> : <SignIn />}
        </div>
    );
}

function SignIn() {

    const[error, setError] = useState("");

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).catch((error)=> {
            setError(error.message);
        });
    };

    return (
        <div style={{textAlign:"center"}}>
            <span>{error}</span><br/>
            <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    )

}

function SignOut() {
    const user = useUserStore();
    function handleSignOut(){auth.signOut()}
    return user && (
        <button className="sign-out" onClick={handleSignOut}>Sign Out</button>
    )
}

function DayPlanner() {
    const [isFlow, setIsFlow] = useState(false);

    return(
    <>
        <SignOut/>
        <div className={"grid-container"}>
            <div className={"Calendar"}>
                <Calendar/>
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
    </>
    )
}

export default App;
