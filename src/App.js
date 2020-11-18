import React, { useState } from 'react';
import './App.css';

import Calendar from './Calendar';
import useSortableData from './UseSortableData'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {Modal} from "@material-ui/core";

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

function TodoList() {
    const query = firestore.collection('Todo');
    const [TodoItems] = useCollectionData(query,{ idField: 'id' });

    const { items, requestSort } = useSortableData(TodoItems ?
        TodoItems.map(item => {
            item.score = item.value / item.time;
            return item;
        }): [], {key:"score", direction:"descending"});

    return(<>
            <table>
                <thead>
                <tr>
                    <th className={"pointer"} onClick={() => requestSort('name')}>To Do</th>
                    <th className={"pointer"} onClick={() => requestSort('score')}>Score</th>
                    <th className={"pointer"} onClick={() => requestSort('value')}>Value</th>
                    <th className={"pointer"} onClick={() => requestSort('time')}>Time</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items && items.map(item =>
                    <TodoItem key={item.id} item={item}/>
                )}
                </tbody>
            </table>
            <AddTodo/>
        </>
    )
}

function TodoItem(props){
    const item = props.item;

    const query = firestore.collection('Todo');
    const [readMode, setReadMode] = useState(true);

    const [title, setTitle] = useState(item.name);
    const [value, setValue] = useState(item.value);
    const [time, setTime] = useState(item.time);

    const [open, setOpen] = React.useState(false);

    const removeTodo = async (id)=>{
        query.doc(id).delete()
    };

    const saveChanges = async () => {
        query.doc(item.id).update({name:title, value:parseInt(value), time:parseInt(time)});
        setReadMode(true)
    };

    const handleClose = ()=>{
        setOpen(false)
    };

    return (<>
            {readMode ?
                <tr key={item.id} onClick={() => setOpen(true)}>
                    <td>{item.name}</td>
                    <td>{(item.value / item.time).toFixed(1)}</td>
                    <td>{item.value}</td>
                    <td>{item.time}</td>
                    <td>
                        <button onClick={() => setReadMode(false)}>edit</button>
                        <button onClick={() => removeTodo(item.id)}>delete</button>
                    </td>
                </tr>
                :
                <tr key={item.id}>
                    <td><input value={title} onChange={(e) => setTitle(e.target.value)}/></td>
                    <td>{(item.value / item.time).toFixed(1)}</td>
                    <td><input type="number" value={value} onChange={(e) => setValue(e.target.value)}/></td>
                    <td><input type="number" value={time} onChange={(e) => setTime(e.target.value)}/></td>
                    <td>
                        <button onClick={() => saveChanges()}>save</button>
                        <button onClick={() => removeTodo(item.id)}>delete</button>
                    </td>
                </tr>
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Description item={item} onClose={handleClose} />
            </Modal>
        </>
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
    const item = props.item;
    const [description, setDescription] = useState(item.description);

    const query = firestore.collection('Todo');

    const save = async ()=>{
        query.doc(item.id).update({description:description})
    };

    return(<>
            <div style={{display: "flex", flexDirection: "column", textAlign:"center", justifyContent: "center", top:"50%", left:"50%", width:"50%", transform:"translate(50%, 15%)", height: "75%"}}>
                <textarea style={{height:"100%", width:"100%"}} value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit" onClick={()=>save()}>Save</button>
            </div>
        </>
    )
}

function PeriodicTodoList() {
    const query = firestore.collection('PeriodicTodo');
    const [TodoItems] = useCollectionData(query,{ idField: 'id' });

    return(<>
            <table>
                <thead>
                <tr>
                    <th>To Do</th>
                    <th>Period</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {TodoItems && TodoItems.map(item =>
                    <PeriodicItem key={item.id} item={item}/>
                )}
                </tbody>
            </table>
            <AddPeriodicTodo/>
        </>
    )
}

function PeriodicItem(props){
    const item = props.item;

    const query = firestore.collection('TodoPeriodic');
    const [readMode, setReadMode] = useState(true);

    const [title, setTitle] = useState(item.name);
    const [period, setPeriod] = useState(item.period);

    const [open, setOpen] = React.useState(false);

    const removeTodo = async (id)=>{
        query.doc(id).delete()
    };

    const saveChanges = async () => {
        query.doc(item.id).update({name:title, period:period});
        setReadMode(true)
    };

    const handleClose = ()=>{
        setOpen(false)
    };

    return (<>
            {readMode ?
                <tr key={item.id} onClick={() => setOpen(true)}>
                    <td>{item.name}</td>
                    <td>{item.period}</td>
                    <td>
                        <button onClick={() => setReadMode(false)}>edit</button>
                        <button onClick={() => removeTodo(item.id)}>delete</button>
                    </td>
                </tr>
                :
                <tr key={item.id}>
                    <td><input value={title} onChange={(e) => setTitle(e.target.value)}/></td>
                    <td><input value={period} onChange={(e) => setPeriod(e.target.value)}/></td>
                    <td>
                        <button onClick={() => saveChanges()}>save</button>
                        <button onClick={() => removeTodo(item.id)}>delete</button>
                    </td>
                </tr>
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Description item={item} onClose={handleClose} />
            </Modal>
        </>
    )
}

function AddPeriodicTodo(){
    const [title, setTitle] = useState('');
    const [period, setPeriod] = useState('');
    const [description, setDescription] = useState('');

    const addTodo = async (e) => {
        e.preventDefault();
        const query = firestore.collection('PeriodicTodo');

        await query.add({name:title, period: period, description:description});

        setTitle('');
        setPeriod('');
        setDescription('');
    };

    return (
        <>
            <form style={{grow: 1, display: "flex", flexDirection: "column", flexWrap: "wrap"}}>
                <label htmlFor="title"><b>Title</b></label>
                <input placeholder="Title" name="title" id="title"
                       value={title} onChange={(e) => setTitle(e.target.value)}/>
                <label htmlFor="period"><b>Period</b></label>
                <input placeholder="Period" name="period" id="period"
                       value={period} onChange={(e) => setPeriod(e.target.value)}/>
                <label htmlFor="description"><b>Description</b></label>
                <textarea placeholder="Description" name="description" id="description"
                          value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit" onClick={addTodo}>Add</button>
            </form>
        </>
    )
}

export default App;
