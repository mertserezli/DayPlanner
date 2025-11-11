import React, { useState, useEffect } from "react";
import { updateTodoDescription, getTodoListQuery } from "./Firebase";
import { getDocs } from "firebase/firestore";

import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Stack,
    Divider
} from "@mui/material";

let timeout;

export default function TaskFlow() {
    const [tasks, setTasks] = useState([]);
    const [curTask, setCurTask] = useState(null);

    const [nextTaskTime, setNextTaskTime] = useState(null);
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        getDocs(getTodoListQuery()).then((snapshot) => {
            const now = new Date();
            const data = [];
            snapshot.forEach((t) => {
                const id = t.id;
                t = t.data();
                t.score = t.value / t.time;
                t.date = now;
                t.id = id;
                data.push(t);
            });
            setTasks(data);
            pickTask(data);
        });
    }, []);

    useEffect(() => {
        if (!nextTaskTime) return;

        const interval = setInterval(() => {
            const diff = Math.max(0, nextTaskTime - Date.now());
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setCountdown(`${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [nextTaskTime]);

    const editTask = (task) => {
        const newTasks = [...tasks.filter((t) => t.name !== task.name), task];
        setTasks(newTasks);
        pickTask(newTasks);
    };

    const removeTask = (task) => {
        const newTasks = tasks.filter((t) => t.name !== task.name);
        setTasks(newTasks);
        pickTask(newTasks);
    };

    function pickTask(tasks) {
        clearTimeout(timeout);
        const eligibleTasks = tasks
            .filter((t) => t.date < new Date())
            .sort((a, b) => b.score - a.score);
        if (eligibleTasks.length > 0) {
            setCurTask(eligibleTasks[0]);
        } else {
            setCurTask(null);
            if (tasks.length > 0) {
                const closest = Math.min(...tasks.map(t => t.date.getTime()));
                setNextTaskTime(closest);
                timeout = setTimeout(() => pickTask(tasks), closest - Date.now() + 500);
            }
        }
    }

    return (
        <Box sx={{ mt: 2 }}>
            {curTask ? (
                <CurrentTask
                    task={curTask}
                    editTask={editTask}
                    removeTask={removeTask}
                />
            ) : (
                <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6" color="text.secondary">
                        No tasks in flow
                    </Typography>
                    {countdown && 0 < tasks.length && (
                        <Typography variant="body2" color="text.secondary">
                            Next task in: <strong>{countdown}</strong>
                        </Typography>)
                    }
                </Paper>
            )}
        </Box>
    );
}

function CurrentTask({ task, editTask, removeTask }) {
    const [description, setDescription] = useState(task.description);
    const [scheduledMinLater, setScheduledMinLater] = useState(30);

    useEffect(() => {
        setDescription(task.description);
        setScheduledMinLater(30);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task]);

    function handleEdit() {
        updateTodoDescription(task.id, description);
        const scheduleDate = new Date();
        scheduleDate.setMinutes(scheduleDate.getMinutes() + scheduledMinLater);
        task.date = scheduleDate;
        task.description = description;
        editTask(task);
    }

    function handleRemove() {
        updateTodoDescription(task.id, description);
        removeTask(task);
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Current Task
            </Typography>

            <Stack spacing={2}>
                <Typography variant="subtitle1">
                    <strong>Title:</strong> {task.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Score:</strong> {task.score.toFixed(2)}
                </Typography>

                <TextField
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <TextField
                    label="Schedule later (minutes)"
                    type="number"
                    fullWidth
                    value={scheduledMinLater}
                    onChange={(e) => setScheduledMinLater(parseInt(e.target.value))}
                />

                <Divider />

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="primary" onClick={handleEdit}>
                        Queue
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleRemove}>
                        Remove
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
}