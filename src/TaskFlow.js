import React, {useState, useEffect, useContext} from "react";

import {UserContext} from "./AuthProvider";

import firebase from 'firebase/app';
import 'firebase/firestore';

const firestore = firebase.firestore();

let timeout;

export default function TaskFlow() {
    const [tasks, setTasks] = useState([]);
    const [curTask, setCurTask] = useState(null);

    const user = useContext(UserContext);
    useEffect(()=> {
        const query = firestore.collection('Users').doc(user.uid).collection('Todo');
        query.get().then((snapshot) => {
            const now = new Date();
            const data = [];
            snapshot.forEach((t) => {
                t = t.data();
                t.score = t.value / t.time;
                t.date = now;
                data.push(t);
            });
            setTasks(data);
            pickTask(data)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const editTask = (task) => {
        const newTasks = [...tasks.filter((t)=> t.name !== task.name), task];
        setTasks(newTasks);
        pickTask(newTasks)
    };

    const removeTask = (task) => {
        const newTasks = tasks.filter((t)=> t.name !== task.name);
        setTasks(newTasks);
        pickTask(newTasks)
    };

    function pickTask(tasks){
        clearTimeout(timeout);
        const eligibleTasks = tasks.filter((t) => t.date < new Date()).sort((a, b)=> b.score - a.score);
        if(0 < eligibleTasks.length) {
            setCurTask(eligibleTasks[0]);
        }else{
            setCurTask(null);
            if (0 < tasks.length) {
                const closest = Math.min(...tasks.map(t => t.date.getTime()));
                timeout = setTimeout(()=>pickTask(tasks), closest - new Date().getTime() + 500);
            }
        }
    }

    return(
        <div>
            {curTask ? <CurrentTask task={curTask} editTask={editTask} removeTask={removeTask} /> : <></>}
        </div>
    )
}

function CurrentTask(props){
    const task = props.task;
    const editTask = props.editTask;
    const removeTask = props.removeTask;

    const [description, setDescription] = useState(task.description);
    const [scheduledMinLater, setScheduledMinLater] = useState(30);

    useEffect(()=> {
        setDescription(task.description);
        setScheduledMinLater(30)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.task]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const scheduleDate = new Date();
        scheduleDate.setMinutes(scheduleDate.getMinutes() + scheduledMinLater);
        editTask({name: task.name, score: task.score, description, date: scheduleDate});
    };

    return(
        <>
            <form onSubmit={handleSubmit}>
                <h2>Current Task</h2>

                <label htmlFor="title">Title: {task.name}</label><br/>

                <label htmlFor="urgency">Score: {task.score}</label><br/>

                <div>
                    <label htmlFor="description">Description:</label><br/>
                    <textarea placeholder="Enter description" rows="4" cols="50" name="description" id="description" required
                              value={description} onChange={event => setDescription(event.target.value)} /><br/>
                </div>

                <label htmlFor="postpone">Schedule later:</label><br/>
                <input type="number" placeholder="How long to postpone in minutes" name="postpone" id="postpone" required
                       value={scheduledMinLater} onChange={event => setScheduledMinLater(parseInt(event.target.value))} /><br/><br/>

                <input type="submit" value="Submit" />
                <input type="button" value="Remove" onClick={()=>removeTask(task)} />
            </form>
        </>
    )
}