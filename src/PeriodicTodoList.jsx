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
    TextField,
    Chip, Stack, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

const ALL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const WEEKENDS = ['Saturday', 'Sunday'];

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
    const weekdayOptions = [
        'Weekdays',
        'Weekends',
        'Daily',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    const [readMode, setReadMode] = useState(true);

    const [title, setTitle] = useState(item.name);
    const [rawPeriods, setRawPeriods] = useState(() =>
        Array.isArray(item.period)
            ? item.period
            : item.period.split(/[\s,]+/).filter(Boolean)
    );

    const normalizedPeriod = rawPeriods.filter(period => period !== 'Weekdays' && period !== 'Weekends' && period !== 'Daily');

    const [open, setOpen] = useState(false);

    const handleToggle = (period) => {
        let updated = [...rawPeriods];

        const hasDays = (days) => days.every(d => updated.includes(d));
        const removeDays = (days) => updated.filter(p => !days.includes(p));
        const addDays = (days) => Array.from(new Set([...updated, ...days]));

        if (period === 'Daily') {
            setRawPeriods(rawPeriods.includes('Daily') ? [] : [...weekdayOptions]);
            return;
        }

        if (period === 'Weekdays') {
            updated = rawPeriods.includes('Weekdays')
                ? removeDays([...WEEKDAYS, 'Weekdays', 'Daily'])
                : addDays([...WEEKDAYS, 'Weekdays']);
        } else if (period === 'Weekends') {
            updated = rawPeriods.includes('Weekends')
                ? removeDays([...WEEKENDS, 'Weekends', 'Daily'])
                : addDays([...WEEKENDS, 'Weekends']);
        } else {
            if (rawPeriods.includes(period)) {
                updated = removeDays([period, 'Daily']);
                if (WEEKDAYS.includes(period)) updated = updated.filter(p => p !== 'Weekdays');
                if (WEEKENDS.includes(period)) updated = updated.filter(p => p !== 'Weekends');
            } else {
                updated = addDays([period]);
            }
        }
        if (hasDays(ALL_DAYS)) updated = [...weekdayOptions];
        else if (hasDays(WEEKDAYS)) updated = addDays(['Weekdays']);
        else if (hasDays(WEEKENDS)) updated = addDays(['Weekends']);

        setRawPeriods(updated);
    };

    async function handleRemovePeriodicTodo(){
        removePeriodicTodoItem(item.id)
    }

    async function saveChanges() {
        updatePeriodicTodoItem(item.id, title, normalizedPeriod.join(', '));
        setReadMode(true);
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
                        {item.name}
                    </TableCell>
                    <TableCell
                        onClick={() => setOpen(true)}
                        sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <PeriodicChip period={item.period} />
                        </Stack>
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
                        <FormControl fullWidth variant="standard">
                            <Select
                                labelId={`period-label-${item.id}`}
                                multiple
                                value={rawPeriods}
                                renderValue={() => parsePeriod(normalizedPeriod.join(', ')).label}
                                variant="standard">
                                {weekdayOptions.map((day) => (
                                    <MenuItem key={day} value={day} onClick={() => handleToggle(day)}>
                                        <Checkbox checked={rawPeriods.includes(day)} />
                                        <ListItemText primary={day} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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

function parsePeriod(periodText) {
    const periodsParts = periodText.split(/[\s,]+/); // split by comma or space
    const dayIndices = periodsParts
        .map(day => ALL_DAYS.indexOf(day))
        .filter(index => index !== -1);

    const periodsSet = new Set(periodsParts);

    if (ALL_DAYS.every(d => periodsSet.has(d)))
        return { type: "daily", dayIndices: [], label: "Daily" }

    let label = [...periodsParts]
    if (WEEKDAYS.every(d => periodsSet.has(d))){
        label = label.filter(d => !WEEKDAYS.includes(d));
        label.push('Weekdays');
    }
    if (WEEKENDS.every(d => periodsSet.has(d))){
        label = label.filter(d => !WEEKENDS.includes(d));
        label.push('Weekends');
    }
    label = [...new Set(label)].join(', ')

    if (dayIndices.length > 0) return { type: "weekly", dayIndices, label};
    return { type: "unknown" };
}

function PeriodicChip({ period }) {
    const parsed = parsePeriod(period);
    const todayIndex = new Date().getDay();
    const isToday =
        parsed.type === "daily" ||
        (parsed.type === "weekly" && parsed.dayIndices.includes(todayIndex));

    const label =
        parsed.type === "daily"
            ? "Daily"
            : parsed.type === "weekly"
                ? `Every ${parsed.label}`
                : period;

    return (
        <Chip
            label={label}
            size="small"
            color={isToday ? "error" : "default"}
            variant={isToday ? "filled" : "outlined"}
        />
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