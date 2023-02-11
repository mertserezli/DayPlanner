import {getPeriodicTodoListQuery, removePeriodicTodoItem, updatePeriodicTodoItem, updatePeriodicTodoDescriptionItem, addPeriodicTodoItem} from "./Firebase";

import Description from './Description'

import {useCollection} from "react-firebase-hooks/firestore";
import React, {useState} from "react";
import Modal from '@mui/material/Modal';

function PeriodicTodoList() {
    const [TodoItems] = useCollection(getPeriodicTodoListQuery());
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

function PeriodicItem({item}){
    const [readMode, setReadMode] = useState(true);

    const [title, setTitle] = useState(item.name);
    const [period, setPeriod] = useState(item.period);

    const [open, setOpen] = useState(false);

    async function handleRemovePeriodicTodo(){
        removePeriodicTodoItem(item.id)
    }

    async function saveChanges(){
        updatePeriodicTodoItem(item.id, title, period);
        setReadMode(true)
    }

    async function saveDescription(description){
        updatePeriodicTodoDescriptionItem(item.id, description);
        setOpen(false)
    }

    function handleClose(){
        setOpen(false)
    }

    return (<>
            {readMode ?
                <tr key={item.id}>
                    <td onClick={() => setOpen(true)}><PeriodicItemNameStyler period={item.period}>{item.name}</PeriodicItemNameStyler></td>
                    <td onClick={() => setOpen(true)}>{item.period}</td>
                    <td>
                        <button onClick={() => setReadMode(false)}>edit</button>
                        <button onClick={handleRemovePeriodicTodo}>delete</button>
                    </td>
                </tr>
                :
                <tr key={item.id}>
                    <td><input value={title} onChange={(e) => setTitle(e.target.value)}/></td>
                    <td><input value={period} onChange={(e) => setPeriod(e.target.value)}/></td>
                    <td>
                        <button onClick={saveChanges}>save</button>
                        <button onClick={handleRemovePeriodicTodo}>delete</button>
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
    const [open, setOpen] = useState(false);

    async function handleAddPeriodicTodo(e){
        e.preventDefault();
        addPeriodicTodoItem(e.target.elements.title.value, e.target.elements.period.value, e.target.elements.description.value);
        setOpen(false)
    }

    function handleClose(){
        setOpen(false)
    }

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
                    <form style={{grow: 1, display: "flex", flexDirection: "column", flexWrap: "wrap"}} onSubmit={handleAddPeriodicTodo}>
                        <label htmlFor="title"><b>Title</b></label>
                        <input placeholder="Title" name="title" id="title"/>
                        <label htmlFor="period"><b>Period</b></label>
                        <input placeholder="Period" name="period" id="period"/>
                        <label htmlFor="description"><b>Description</b></label>
                        <textarea placeholder="Description" name="description" id="description"/>
                        <button type="submit">Add</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default PeriodicTodoList