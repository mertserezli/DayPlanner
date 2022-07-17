import {firestore} from "./Firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

import Description from './Description'

import {useCollection} from "react-firebase-hooks/firestore";
import React, {useState} from "react";
import Modal from '@mui/material/Modal';
import {useUserStore} from "./AuthProvider";

function PeriodicTodoList() {
    const user = useUserStore();
    const query = collection(firestore, 'Users', user.uid, 'PeriodicTodo');
    const [TodoItems] = useCollection(query,{ idField: 'id' });
    const items = TodoItems ?
        TodoItems.docs.map(item => {
            let id = item.id;
            item = item.data();
            item.id = id;
            return item;
        })
        :
        [];

    return(<>
            <AddPeriodicTodo/>
            <table>
                <thead>
                <tr>
                    <th>To Do</th>
                    <th>Period</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {items && items.map(item =>
                    <PeriodicItem key={item.id} item={item}/>
                )}
                </tbody>
            </table>
        </>
    )
}

function PeriodicItem(props){
    const item = props.item;

    const user = useUserStore();
    const query = collection(firestore, 'Users', user.uid, 'PeriodicTodo');
    const [readMode, setReadMode] = useState(true);

    const [title, setTitle] = useState(item.name);
    const [period, setPeriod] = useState(item.period);

    const [open, setOpen] = useState(false);

    const removePeriodicTodo = async (id)=>{
        deleteDoc(doc(query, id));
    };

    const saveChanges = async () => {
        updateDoc(doc(query, item.id), {name:title, period:period});
        setReadMode(true)
    };

    const saveDescription = async (description) => {
        updateDoc(doc(query, item.id),{description:description})
    };

    const handleClose = ()=>{
        setOpen(false)
    };

    return (<>
            {readMode ?
                <tr key={item.id}>
                    <td onClick={() => setOpen(true)}><PeriodicItemNameStyler period={item.period}>{item.name}</PeriodicItemNameStyler></td>
                    <td onClick={() => setOpen(true)}>{item.period}</td>
                    <td>
                        <button onClick={() => setReadMode(false)}>edit</button>
                        <button onClick={() => removePeriodicTodo(item.id)}>delete</button>
                    </td>
                </tr>
                :
                <tr key={item.id}>
                    <td><input value={title} onChange={(e) => setTitle(e.target.value)}/></td>
                    <td><input value={period} onChange={(e) => setPeriod(e.target.value)}/></td>
                    <td>
                        <button onClick={() => saveChanges()}>save</button>
                        <button onClick={() => removePeriodicTodo(item.id)}>delete</button>
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

function PeriodicItemNameStyler(props){
    const period = props.period;
    const toDayName = {0:'sunday', 1:'monday', 2:'tuesday', 3:'wednesday', 4:'thursday', 5:'friday', 6:'saturday'};

    const today = new Date();
    const isToday = period.toLowerCase().includes(toDayName[today.getDay()]) || period.toLowerCase().includes("daily");

    return(<>
        {isToday ?
            <span style={{color:"Crimson"}}>{props.children}</span>
            :
            <span>{props.children}</span>
        }
        </>
    );
}

function AddPeriodicTodo(){
    const [title, setTitle] = useState('');
    const [period, setPeriod] = useState('');
    const [description, setDescription] = useState('');

    const [open, setOpen] = useState(false);

    const user = useUserStore();
    const query = collection(firestore, 'Users', user.uid, 'PeriodicTodo');

    const addTodo = async (e) => {
        e.preventDefault();

        addDoc(query, {name:title, period: period, description:description});

        setTitle('');
        setPeriod('');
        setDescription('');
    };

    const handleClose = ()=>{
        setOpen(false)
    };

    return (
        <>
            <button onClick={()=>setOpen(true)}>Add Periodic</button>
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
                        <label htmlFor="period"><b>Period</b></label>
                        <input placeholder="Period" name="period" id="period"
                               value={period} onChange={(e) => setPeriod(e.target.value)}/>
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

export default PeriodicTodoList