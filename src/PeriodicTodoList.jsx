import {
  getPeriodicTodoListQuery,
  removePeriodicTodoItem,
  updatePeriodicTodoItem,
  updatePeriodicTodoDescriptionItem,
  addPeriodicTodoItem,
} from './Firebase';

import DescriptionDialog from './DescriptionDialog';

import { useCollection } from 'react-firebase-hooks/firestore';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  ListItemIcon,
  Menu,
  Tooltip,
  useTheme,
  useMediaQuery,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function PeriodicTodoList() {
  const [TodoItems] = useCollection(getPeriodicTodoListQuery());
  const items = TodoItems
    ? TodoItems.docs.map((item) => {
        let id = item.id;
        item = item.data();
        item.id = id;
        return item;
      })
    : [];

  return (
    <>
      <AddPeriodicTodo />
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table aria-label="periodic todo list table">
          <TableHead>
            <TableRow>
              <TableCell>To Do</TableCell>
              <TableCell>Period</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item) => <PeriodicItem key={item.id} item={item} />)
            ) : (
              <Fade in={true} timeout={500}>
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                    <PlaylistAddCheckIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      No periodic tasks yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click <strong>&#34;Add Periodic&#34;</strong> to create a recurring to-do.
                    </Typography>
                  </TableCell>
                </TableRow>
              </Fade>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

PeriodicItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    period: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  }).isRequired,
};
function PeriodicItem({ item }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);

  async function saveDescription(description) {
    updatePeriodicTodoDescriptionItem(item.id, description);
    setDescriptionDialogOpen(false);
  }

  return (
    <>
      <TableRow
        key={item.id}
        sx={{
          '&:nth-of-type(odd)': {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
          '&:hover': {
            backgroundColor: (theme) => theme.palette.action.selected,
          },
        }}
      >
        <TableCell
          component="th"
          scope="row"
          onClick={() => setDescriptionDialogOpen(true)}
          sx={{
            cursor: 'pointer',
            maxWidth: 150,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.name}
        </TableCell>
        <TableCell onClick={() => setDescriptionDialogOpen(true)} sx={{ cursor: 'pointer' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PeriodicChip period={item.period} />
          </Stack>
        </TableCell>
        <TableCell align="right" sx={{ position: 'relative' }}>
          <IconButton
            aria-label="more actions"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
            className="action-menu"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1,
              opacity: { xs: 1, sm: 0 },
              '.MuiTableRow-root:hover &': { opacity: 1 },
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {isDesktop ? (
              <Tooltip title="More actions">
                <MoreVertIcon />
              </Tooltip>
            ) : (
              <MoreVertIcon />
            )}
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                setEditDialogOpen(true);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDeleteDialogOpen(true);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>

      <EditPeriodicDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        initialData={item}
      />

      <ConfirmDeletePeriodicDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => removePeriodicTodoItem(item.id)}
      />

      <DescriptionDialog
        item={item}
        onClose={() => setDescriptionDialogOpen(false)}
        saveDescription={saveDescription}
        open={descriptionDialogOpen}
      />
    </>
  );
}

function parsePeriod(periodText) {
  const ALL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const WEEKENDS = ['Saturday', 'Sunday'];

  const periodsParts = periodText.split(/[\s,]+/); // split by comma or space
  const dayIndices = periodsParts
    .map((day) => ALL_DAYS.indexOf(day))
    .filter((index) => index !== -1);

  const periodsSet = new Set(periodsParts);

  if (ALL_DAYS.every((d) => periodsSet.has(d)))
    return { type: 'daily', dayIndices: [], label: 'Daily' };

  let label = [...periodsParts];
  if (WEEKDAYS.every((d) => periodsSet.has(d))) {
    label = label.filter((d) => !WEEKDAYS.includes(d));
    label.push('Weekdays');
  }
  if (WEEKENDS.every((d) => periodsSet.has(d))) {
    label = label.filter((d) => !WEEKENDS.includes(d));
    label.push('Weekends');
  }

  if (dayIndices.length > 0) return { type: 'weekly', dayIndices, label: label.join(', ') };
  return { type: 'unknown' };
}

PeriodicChip.propTypes = {
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
};
function PeriodicChip({ period }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const parsed = parsePeriod(period);
  const todayIndex = new Date().getDay();
  const isToday =
    parsed.type === 'daily' || (parsed.type === 'weekly' && parsed.dayIndices.includes(todayIndex));

  let label;
  if (parsed.type === 'daily') {
    label = 'Daily';
  } else if (parsed.type === 'weekly') {
    label = isMobile
      ? period
          .split(', ')
          .map((day) => day.slice(0, 2))
          .join(', ')
      : `Every ${parsed.label}`;
  } else {
    label = period;
  }

  return (
    <Chip
      label={label}
      size="small"
      color={isToday ? 'error' : 'default'}
      variant={isToday ? 'filled' : 'outlined'}
    />
  );
}

PeriodicDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    period: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    description: PropTypes.string,
  }),
  mode: PropTypes.oneOf(['add', 'edit']),
};

function PeriodicDialog({ open, onClose, onSubmit, initialData = {}, mode = 'add' }) {
  const weekdayOptions = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const [title, setTitle] = useState(initialData.name || '');
  const [periods, setPeriods] = useState(
    Array.isArray(initialData.period)
      ? initialData.period
      : (initialData.period || '').split(/[\s,]+/).filter(Boolean)
  );
  const [description, setDescription] = useState(initialData.description || '');

  useEffect(() => {
    if (open) {
      setTitle(initialData.name || '');
      setPeriods(
        Array.isArray(initialData.period)
          ? initialData.period
          : (initialData.period || '').split(/[\s,]+/).filter(Boolean)
      );
      setDescription(initialData.description || '');
    }
  }, [open]);

  const sortPeriods = (periods) => {
    const priorityMap = {
      Daily: 0,
      Weekdays: 1,
      Weekends: 2,
    };

    return [...periods].sort((a, b) => {
      if (priorityMap[a] !== undefined || priorityMap[b] !== undefined) {
        return (priorityMap[a] ?? 99) - (priorityMap[b] ?? 99);
      }
      return weekdayOptions.indexOf(a) - weekdayOptions.indexOf(b);
    });
  };

  const handleToggle = (day) => {
    setPeriods((prev) => {
      let next = prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day];

      return sortPeriods(next);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      name: title,
      period: periods.join(', '),
      description,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{mode === 'add' ? 'Add Periodic To-Do' : 'Edit Periodic To-Do'}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            required
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth variant="standard">
            <InputLabel id={`period-label-${initialData?.id || 'new'}`}>Period</InputLabel>
            <Select
              labelId={`period-label-${initialData?.id || 'new'}`}
              multiple
              value={periods}
              renderValue={(selected) => parsePeriod(selected.join(', ')).label}
              variant="standard"
            >
              {weekdayOptions.map((day) => (
                <MenuItem key={day} value={day} onClick={() => handleToggle(day)}>
                  <Checkbox checked={periods.includes(day)} />
                  <ListItemText primary={day} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select one or more days for this periodic task</FormHelperText>
          </FormControl>
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function AddPeriodicTodo() {
  const [open, setOpen] = useState(false);

  const handleAdd = (newItem) => {
    addPeriodicTodoItem(newItem.name, newItem.period, newItem.description);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Periodic
      </Button>

      <PeriodicDialog open={open} onClose={() => setOpen(false)} onSubmit={handleAdd} mode="add" />
    </>
  );
}

EditPeriodicDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

function EditPeriodicDialog({ open, onClose, initialData }) {
  const handleEdit = (updatedItem) => {
    updatePeriodicTodoItem(
      updatedItem.id,
      updatedItem.name,
      updatedItem.period,
      updatedItem.description
    );
  };

  return (
    <PeriodicDialog
      open={open}
      onClose={onClose}
      initialData={initialData}
      onSubmit={handleEdit}
      mode="edit"
    />
  );
}

ConfirmDeletePeriodicDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

function ConfirmDeletePeriodicDialog({ open, onClose, onConfirm }) {
  function handleRemove() {
    onClose();
    onConfirm();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this periodic to-do item?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleRemove} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PeriodicTodoList;
