import React, { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Fade,
  MenuItem,
  Menu,
  ListItemIcon,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import DescriptionDialog from './DescriptionDialog';
import useSortableData from './UseSortableData';

import {
  getTodoListQuery,
  removeTodoItem,
  updateTodoItem,
  updateTodoDescription,
  addTodoItem,
  addCalendarItem,
} from './Firebase';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function TodoList() {
  const [TodoItems] = useCollection(getTodoListQuery());
  const { t } = useTranslation();

  const { items, requestSort, sortConfig } = useSortableData(
    TodoItems
      ? TodoItems.docs.map((item) => {
          let id = item.id;
          item = item.data();
          item.id = id;
          item.score = item.value / item.time;
          return item;
        })
      : [],
    { key: 'score', direction: 'desc' }
  );

  const createSortHandler = (property) => () => {
    requestSort(property);
  };

  return (
    <>
      <AddTodo />
      <TableContainer
        component={Paper}
        sx={{ marginTop: 2, overflowX: 'auto', '@media (max-width: 600px)': { maxWidth: '100vw' } }}
      >
        <Table aria-label="todo list table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig?.key === 'name'}
                  direction={sortConfig?.key === 'name' ? sortConfig.direction : 'asc'}
                  onClick={createSortHandler('name')}
                >
                  {t('todoList.columns.name')}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortConfig?.key === 'score'}
                  direction={sortConfig?.key === 'score' ? sortConfig.direction : 'asc'}
                  onClick={createSortHandler('score')}
                >
                  {t('todoList.columns.score')}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel
                  active={sortConfig?.key === 'value'}
                  direction={sortConfig?.key === 'value' ? sortConfig.direction : 'asc'}
                  onClick={createSortHandler('value')}
                >
                  {t('todoList.columns.value')}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <TableSortLabel
                  active={sortConfig?.key === 'time'}
                  direction={sortConfig?.key === 'time' ? sortConfig.direction : 'asc'}
                  onClick={createSortHandler('time')}
                >
                  {t('todoList.columns.time')}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item) => <TodoItem key={item.id} item={item} />)
            ) : (
              <Fade in={true} timeout={500}>
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <PlaylistAddCheckIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="subtitle1" color="text.secondary">
                      {t('todoList.empty.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('todoList.empty.subtitle')}
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

function TodoItem({ item }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
          '&:hover .action-menu': {
            opacity: 1,
          },
        }}
      >
        <TableCell
          component="th"
          scope="row"
          onClick={() => setDescriptionDialogOpen(true)}
          sx={{
            cursor: 'pointer',
            maxWidth: 200,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Tooltip title={item.name}>
            <span>{item.name}</span>
          </Tooltip>
        </TableCell>
        <TableCell
          align="right"
          onClick={() => setDescriptionDialogOpen(true)}
          sx={{ cursor: 'pointer' }}
        >
          {(item.value / item.time).toFixed(1)}
        </TableCell>
        <TableCell
          align="right"
          onClick={() => setDescriptionDialogOpen(true)}
          sx={{
            cursor: 'pointer',
            display: { xs: 'none', sm: 'table-cell' },
          }}
        >
          {item.value}
        </TableCell>
        <TableCell
          align="right"
          onClick={() => setDescriptionDialogOpen(true)}
          sx={{
            cursor: 'pointer',
            display: { xs: 'none', sm: 'table-cell' },
          }}
        >
          {item.time}
        </TableCell>
        <TableCell align="right" sx={{ position: 'relative' }}>
          <IconButton
            aria-label="actions"
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
              <Tooltip title={t('actions')}>
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
                const nextDate = new Date();
                nextDate.setMinutes(nextDate.getMinutes() + (15 - (nextDate.getMinutes() % 15)));
                nextDate.setSeconds(1);
                nextDate.setMilliseconds(0);
                addCalendarItem({
                  allDay: false,
                  endDate: nextDate,
                  startDate: nextDate,
                  title: item.name,
                });
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <EventAvailableIcon fontSize="small" />
              </ListItemIcon>
              {t('addToCalendar')}
            </MenuItem>
            <MenuItem
              onClick={() => {
                setEditDialogOpen(true);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              {t('common.edit')}
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
              {t('common.delete')}
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>

      <EditTodoDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        initialData={item}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => removeTodoItem(item.id)}
      />

      <DescriptionDialog
        item={item}
        onClose={() => setDescriptionDialogOpen(false)}
        saveDescription={(description) => updateTodoDescription(item.id, description)}
        open={descriptionDialogOpen}
      />
    </>
  );
}

function TodoDialog({ open, onClose, onSubmit, initialData = {}, mode = 'add' }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialData.name || '');
  const [value, setValue] = useState(initialData.value || '');
  const [time, setTime] = useState(initialData.time || '');
  const [description, setDescription] = useState(initialData.description || '');

  useEffect(() => {
    if (open) {
      setTitle(initialData.name || '');
      setValue(initialData.value || '');
      setTime(initialData.time || '');
      setDescription(initialData.description || '');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      name: title,
      value: parseInt(value),
      time: parseInt(time),
      description,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'add' ? t('todoDialog.addTitle') : t('todoDialog.editTitle')}
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            required
            label={t('todoDialog.fields.title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            required
            name="Value"
            label={t('todoDialog.fields.value')}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
            fullWidth
          />
          <TextField
            required
            name="Time"
            label={t('todoDialog.fields.time')}
            type="text"
            inputMode="numeric"
            value={time}
            onChange={(e) => setTime(e.target.value.replace(/\D/g, ''))}
            fullWidth
          />
          <TextField
            label={t('description')}
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? t('common.add') : t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function AddTodo() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        {t('addTodo')}
      </Button>

      <TodoDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(newItem) =>
          addTodoItem(newItem.name, newItem.value, newItem.time, newItem.description)
        }
        mode="add"
      />
    </>
  );
}

function EditTodoDialog({ open, onClose, initialData }) {
  const handleEdit = (updatedItem) => {
    updateTodoItem(
      updatedItem.id,
      updatedItem.name,
      updatedItem.value,
      updatedItem.time,
      updatedItem.description
    );
  };

  return (
    <TodoDialog
      open={open}
      onClose={onClose}
      initialData={initialData}
      onSubmit={handleEdit}
      mode="edit"
    />
  );
}

function ConfirmDeleteDialog({ open, onClose, onConfirm }) {
  const { t } = useTranslation();

  function handleRemove() {
    onClose();
    onConfirm();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('confirmDelete.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('confirmDelete.message')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={handleRemove} color="error" variant="contained">
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TodoList;
