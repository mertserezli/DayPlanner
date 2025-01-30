import {useCollection} from "react-firebase-hooks/firestore";

import React, {useState} from "react";

import Modal from '@mui/material/Modal';

import Description from "./Description";
import useSortableData from "./UseSortableData";

import {getTodoListQuery, removeTodoItem, updateTodoItem, updateTodoDescription, addTodoItem} from "./Firebase";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";

function TodoList() {
    const [TodoItems] = useCollection(getTodoListQuery());

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

function TodoItem({item}){
    const [readMode, setReadMode] = useState(true);

    const [title, setTitle] = useState(item.name);
    const [value, setValue] = useState(item.value);
    const [time, setTime] = useState(item.time);

    const [open, setOpen] = useState(false);

    async function handleRemoveTodo(){
        removeTodoItem(item.id)
    }

    async function  saveChanges(){
        updateTodoItem(item.id, title, parseInt(value), parseInt(time));
        setReadMode(true)
    }

    async function saveDescription(description){
        setOpen(false);
        updateTodoDescription(item.id, description);
    }

    function handleClose(){
        setOpen(false)
    }

    return (<>
            {readMode ?
                <tr key={item.id}>
                    <td onClick={() => setOpen(true)}>{item.name}</td>
                    <td onClick={() => setOpen(true)}>{(item.value / item.time).toFixed(1)}</td>
                    <td onClick={() => setOpen(true)}>{item.value}</td>
                    <td onClick={() => setOpen(true)}>{item.time}</td>
                    <td>
                        <IconButton aria-label="edit a to-do item" size="small" onClick={() => setReadMode(false)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete a to-do item" size="small" onClick={handleRemoveTodo}>
                            <DeleteIcon />
                        </IconButton>
                    </td>
                </tr>
                :
                <tr key={item.id}>
                    <td><input value={title} onChange={(e) => setTitle(e.target.value)}/></td>
                    <td>{(item.value / item.time).toFixed(1)}</td>
                    <td><input type="number" value={value} onChange={(e) => setValue(e.target.value)}/></td>
                    <td><input type="number" value={time} onChange={(e) => setTime(e.target.value)}/></td>
                    <td>
                        <IconButton aria-label="save the to-do item" size="small" onClick={saveChanges}>
                            <SaveIcon />
                        </IconButton>
                        <IconButton aria-label="delete a to-do item" size="small" onClick={handleRemoveTodo}>
                            <DeleteIcon />
                        </IconButton>
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
    const [open, setOpen] = useState(false);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        addTodoItem(e.target.elements.title.value, parseInt(e.target.elements.value.value), parseInt(e.target.elements.time.value), e.target.elements.description.value);
        setOpen(false)
    };

    function handleClose(){
        setOpen(false)
    }

    return (
        <>
            <Button variant="contained" color="primary" startIcon={<AddCircleIcon />} onClick={()=>setOpen(true)}>
                Add To-Do
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={{display: "flex", flexDirection: "column", top:"50%", left:"50%", width:"40%", transform:"translate(70%, 80%)", backgroundColor:"white", padding: "25px", borderRadius: "10px"}}>
                    <form style={{grow: 1, display: "flex", flexDirection: "column", flexWrap: "wrap"}} onSubmit={handleAddTodo}>
                        <label htmlFor="title"><b>Title</b></label>
                        <input placeholder="Title" name="title" id="title"/>
                        <label htmlFor="value"><b>Value</b></label>
                        <input placeholder="INTRINSIC Value" type="number" name="value" id="value"/>
                        <label htmlFor="time"><b>Time</b></label>
                        <input placeholder="Time(minutes)" type="number" name="time" id="time"/>
                        <label htmlFor="description"><b>Description</b></label>
                        <textarea placeholder="Description" name="description" id="description"/>
                        <button type="submit">Add</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default TodoList