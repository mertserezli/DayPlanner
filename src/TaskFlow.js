import React, {useState, useEffect, useCallback, useContext} from "react";

import {UserContext} from "./AuthProvider";

import firebase from 'firebase/app';
import 'firebase/firestore';

const firestore = firebase.firestore();

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
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const editTask = (task) => {
        setTasks([...tasks.filter((t)=> t.name !== task.name), task]);
        setCurTask(null)
    };

    const removeTask = (task) => {
        setTasks(tasks.filter((t)=> t.name !== task.name));
        setCurTask(null)
    };

    const pickTask = useCallback(() =>{
        const eligibleTasks = tasks.filter((t) => t.date < new Date());
        eligibleTasks.sort((a, b)=> b.score - a.score);
        setCurTask(eligibleTasks[0]);
    },[tasks]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!curTask){
                pickTask()
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [curTask, pickTask]);

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

    const [name, setName] = useState(task.name);
    const [score, setScore] = useState(task.score);
    const [description, setDescription] = useState(task.description);
    const [scheduledMinLater, setScheduledMinLater] = useState(30);

    const handleSubmit = (event) => {
        event.preventDefault();
        const scheduleDate = new Date();
        scheduleDate.setMinutes(scheduleDate.getMinutes() + scheduledMinLater);
        editTask({name, score, description, date: scheduleDate});
    };

    return(
        <>
            <form onSubmit={handleSubmit}>
                <h2>Current Task</h2>

                <label htmlFor="title">Title:</label><br/>
                <input placeholder="Enter Title" name="title" id="title" required
                       value={name} onChange={event => setName(event.target.value)} /><br/>

                <label htmlFor="urgency">Score:</label><br/>
                <input type="number" placeholder="Enter new score" name="score" id="score" required
                       value={score} onChange={event => setScore(parseInt(event.target.value))} /><br/>

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