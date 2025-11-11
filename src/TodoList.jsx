import {useCollection} from "react-firebase-hooks/firestore";

import React, {useState} from "react";

import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
    Paper,
    TextField,
    Dialog, DialogTitle, DialogActions, DialogContent, Fade
} from '@mui/material';

import DescriptionDialog from "./DescriptionDialog";
import useSortableData from "./UseSortableData";

import {getTodoListQuery, removeTodoItem, updateTodoItem, updateTodoDescription, addTodoItem} from "./Firebase";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function TodoList() {
    const [TodoItems] = useCollection(getTodoListQuery());

    const { items, requestSort, sortConfig } = useSortableData(TodoItems ?
        TodoItems.docs.map(item => {
            let id = item.id;
            item = item.data();
            item.id = id;
            item.score = item.value / item.time;
            return item;
        }): [], {key:"score", direction:"desc"});

    const createSortHandler = (property) => () => {
        requestSort(property);
    };

    return(<>
            <AddTodo/>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table aria-label="todo list table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig?.key === 'name'}
                                    direction={sortConfig?.key === 'name' ? sortConfig.direction : 'asc'}
                                    onClick={createSortHandler('name')}
                                >
                                    To Do
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortConfig?.key === 'score'}
                                    direction={sortConfig?.key === 'score' ? sortConfig.direction : 'asc'}
                                    onClick={createSortHandler('score')}
                                >
                                    Score
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortConfig?.key === 'value'}
                                    direction={sortConfig?.key === 'value' ? sortConfig.direction : 'asc'}
                                    onClick={createSortHandler('value')}
                                >
                                    Value
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortConfig?.key === 'time'}
                                    direction={sortConfig?.key === 'time' ? sortConfig.direction : 'asc'}
                                    onClick={createSortHandler('time')}
                                >
                                    Time
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items && items.length > 0 ? (
                            items.map(item => <TodoItem key={item.id} item={item} />)
                        ) : (
                            <Fade in={true} timeout={500}>
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                        <PlaylistAddCheckIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="subtitle1" color="text.secondary">
                                            No to-do items yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Click <strong>"Add To-Do"</strong> to create your first task.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </Fade>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
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
                <TableRow key={item.id} sx={{
                    '&:nth-of-type(odd)': {
                        backgroundColor: (theme) => theme.palette.action.hover,
                    },
                }}>
                    <TableCell
                        component="th"
                        scope="row"
                        onClick={() => setOpen(true)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        {item.name}
                    </TableCell>
                    <TableCell
                        align="right"
                        onClick={() => setOpen(true)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        {(item.value / item.time).toFixed(1)}
                    </TableCell>
                    <TableCell
                        align="right"
                        onClick={() => setOpen(true)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        {item.value}
                    </TableCell>
                    <TableCell
                        align="right"
                        onClick={() => setOpen(true)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        {item.time}
                    </TableCell>
                    <TableCell align="center">
                        <IconButton aria-label="edit a to-do item" size="small" onClick={() => setReadMode(false)}>
                            <EditIcon />
                        </IconButton>
                        <ConfirmDeleteButton onConfirm={handleRemoveTodo}/>
                    </TableCell>
                </TableRow>
                :
                <TableRow key={item.id} sx={{
                    '&:nth-of-type(odd)': {
                        backgroundColor: (theme) => theme.palette.action.hover,
                    },
                }}>
                    <TableCell component="th" scope="row">
                        <TextField
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            variant="standard"
                            sx={{ width: "120px" }}
                        />
                    </TableCell>
                    <TableCell align="right">{(item.value / item.time).toFixed(1)}</TableCell>
                    <TableCell align="right">
                        <TextField
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            variant="standard"
                            sx={{ width: '80px' }}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <TextField
                            type="number"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            variant="standard"
                            sx={{ width: '80px' }}
                        />
                    </TableCell>
                    <TableCell align="center">
                        <IconButton aria-label="save the to-do item" size="small" onClick={saveChanges}>
                            <SaveIcon />
                        </IconButton>
                        <ConfirmDeleteButton onConfirm={handleRemoveTodo}/>
                    </TableCell>
                </TableRow>
            }

            <DescriptionDialog item={item} onClose={handleClose} saveDescription={saveDescription} open={open}/>
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

    return (
        <>
            <Button variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={()=>setOpen(true)}
                    sx={{ mb: 2 }}>
                Add To-Do
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <form onSubmit={handleAddTodo}>
                    <DialogTitle>Add a new To-Do</DialogTitle>
                    <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <TextField
                            required
                            name="title"
                            type="text"
                            id="outlined-required"
                            inputMode="text"
                            label="Title"
                            fullWidth
                        />
                        <TextField
                            required
                            name="value"
                            type="text"
                            inputMode="numeric"
                            label="Value"
                            onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                            fullWidth
                        />
                        <TextField
                            required
                            name="time"
                            type="text"
                            inputMode="numeric"
                            label="Time(minutes)"
                            onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                            fullWidth
                        />
                        <TextField
                            name="description"
                            id="outlined-textarea"
                            label="Description"
                            multiline
                            minRows={3}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained">
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}

function ConfirmDeleteButton({ onConfirm }) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        onConfirm();
        setOpen(false);
    };

    return (
        <>
            <IconButton
                aria-label="delete a to-do item"
                size="small"
                onClick={() => setOpen(true)}
            >
                <DeleteIcon />
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this to-do item?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default TodoList