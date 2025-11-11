import {getPeriodicTodoListQuery, removePeriodicTodoItem, updatePeriodicTodoItem, updatePeriodicTodoDescriptionItem, addPeriodicTodoItem} from "./Firebase";

import DescriptionDialog from './DescriptionDialog'

import {useCollection} from "react-firebase-hooks/firestore";
import React, {useState} from "react";

import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Button from "@mui/material/Button";
import {
    Dialog,
    DialogActions, DialogContent, DialogTitle, Fade,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

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
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table aria-label="periodic todo list table">
                    <TableHead>
                        <TableRow>
                            <TableCell>To Do</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items && items.length > 0 ? (
                            items.map(item => <PeriodicItem key={item.id} item={item} />)
                        ) : (
                            <Fade in={true} timeout={500}>
                                <TableRow>
                                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                        <PlaylistAddCheckIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="subtitle1" color="text.secondary">
                                            No periodic tasks yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Click <strong>"Add Periodic"</strong> to create a recurring to-do.
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
                        <PeriodicItemNameStyler period={item.period}>{item.name}</PeriodicItemNameStyler>
                    </TableCell>
                    <TableCell
                        onClick={() => setOpen(true)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        {item.period}
                    </TableCell>
                    <TableCell align="center">
                        <IconButton aria-label="edit a periodic item" size="small" onClick={() => setReadMode(false)}>
                            <EditIcon />
                        </IconButton>
                        <ConfirmDeletePeriodicButton onConfirm={handleRemovePeriodicTodo}/>
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
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            variant="standard"
                        />
                    </TableCell>
                    <TableCell align="center">
                        <IconButton aria-label="save the periodic item" size="small" onClick={saveChanges}>
                            <SaveIcon />
                        </IconButton>
                        <ConfirmDeletePeriodicButton onConfirm={handleRemovePeriodicTodo}/>
                    </TableCell>
                </TableRow>
            }

            <DescriptionDialog item={item} onClose={handleClose} saveDescription={saveDescription} open={open}/>
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

    return (
        <>
            <Button variant="contained" color="primary" startIcon={<AddCircleIcon />} onClick={()=>setOpen(true)} sx={{ mb: 2 }}>
                Add Periodic
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <form onSubmit={handleAddPeriodicTodo}>
                    <DialogTitle>Add a Periodic To-Do</DialogTitle>
                    <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <TextField
                            required
                            name="title"
                            label="Title"
                            type="text"
                            inputMode="text"
                            fullWidth
                        />
                        <TextField
                            required
                            name="period"
                            label="Period"
                            type="text"
                            inputMode="text"
                            fullWidth
                        />
                        <TextField
                            name="description"
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

function ConfirmDeletePeriodicButton({ onConfirm }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                aria-label="delete a periodic item"
                size="small"
                onClick={() => setOpen(true)}
            >
                <DeleteIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="confirm-delete-periodic"
            >
                <DialogTitle aria-labelledby="confirm-delete-periodic">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this periodic to-do item?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            setOpen(false);
                        }}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default PeriodicTodoList