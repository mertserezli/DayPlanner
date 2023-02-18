import React, {useState} from 'react';
import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";

import Calendar from './Calendar';
import PeriodicTodoList from './PeriodicTodoList'
import TodoList from "./TodoList";
import AuthProvider, {useUserStore} from "./AuthProvider";
import {auth} from "./Firebase";
import SignIn from "./SignIn"
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";

import TaskFlow from "./TaskFlow";

function App() {
    return (
      <AuthProvider>
          <Routes>
              <Route path={"/"} element={<Application/>} />
              <Route path={"/signin"} element={<SignIn/>} />
              <Route path={"/signup"} element={<SignUp/>} />
              <Route path={"/forgotpassword"} element={<ForgotPassword/>} />
          </Routes>
      </AuthProvider>
    );
}

function Application() {
    const {user, loading} = useUserStore();
    return(
        <div className="App">
            {loading ? <>< /> : user ? <DayPlanner /> : <Navigate replace to="/signin" />}
        </div>
    );
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
