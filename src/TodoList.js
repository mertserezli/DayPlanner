import {useCollection} from "react-firebase-hooks/firestore";

import React, {useState} from "react";

import Modal from '@mui/material/Modal';

import Description from "./Description";
import useSortableData from "./UseSortableData";
import {useUserStore} from "./AuthProvider";

import {firestore} from "./Firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

function TodoList() {
    const user = useUserStore();
    const query = collection(firestore, 'Users', user.uid, 'Todo');
    const [TodoItems] = useCollection(query,{ idField: 'id' });

    const { items, requestSort } = useSortableData(TodoItems ?
        TodoItems.docs.map(item => {
            let id = item.id;
            item = item.data();
            item.id = id;
            item.score = item.value / item.time;
            return item;
        }): [], {key:"score", direction:"descending"});

    return(<>
            <AddTodo/>
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
        </>
    )
}

function TodoItem(props){
    const user = useUserStore();
    const query = collection(firestore, 'Users', user.uid, 'Todo');
    const item = props.item;

    const [readMode, setReadMode] = useState(true);

    const [title, setTitle] = useState(item.name);
    const [value, setValue] = useState(item.value);
    const [time, setTime] = useState(item.time);

    const [open, setOpen] = useState(false);

    const removeTodo = async (id)=>{
        deleteDoc(doc(query, id));
    };

    const saveChanges = async () => {
        updateDoc(doc(query, item.id), {name:title, value:parseInt(value), time:parseInt(time)});
        setReadMode(true)
    };

    const saveDescription = async (description) => {
        setOpen(false);
        updateDoc(doc(query, item.id), {description:description})
    };

    const handleClose = ()=>{
        setOpen(false)
    };

    return (<>
            {readMode ?
                <tr key={item.id}>
                    <td onClick={() => setOpen(true)}>{item.name}</td>
                    <td onClick={() => setOpen(true)}>{(item.value / item.time).toFixed(1)}</td>
                    <td onClick={() => setOpen(true)}>{item.value}</td>
                    <td onClick={() => setOpen(true)}>{item.time}</td>
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
                <Description item={item} onClose={handleClose} saveDescription={saveDescription} />
            </Modal>
        </>
    )
}

function AddTodo(){
    const user = useUserStore();
    const query = collection(firestore, 'Users', user.uid, 'Todo');

    const [title, setTitle] = useState('');
    const [value, setValue] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');

    const [open, setOpen] = useState(false);

    const addTodo = async (e) => {
        e.preventDefault();

        addDoc(query, {name:title, value:parseInt(value), time:parseInt(time), description:description});

        setTitle('');
        setValue('');
        setTime('');
        setDescription('');

        setOpen(false)
    };

    const handleClose = ()=>{
        setOpen(false)
    };

    return (
        <>
            <button onClick={()=>setOpen(true)}>Add</button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={{display: "flex", flexDirection: "column", top:"50%", left:"50%", width:"40%", transform:"translate(70%, 80%)", backgroundColor:"white", padding: "25px", borderRadius: "10px"}}>
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
                </div>
            </Modal>
        </>
    )
}

export default TodoList