import { useCollection } from 'react-firebase-hooks/firestore';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  getPeriodicTodoListQuery,
  removePeriodicTodoItem,
  updatePeriodicTodoItem,
  updatePeriodicTodoDescriptionItem,
  addPeriodicTodoItem,
  addCalendarItem,
} from './Firebase';
import DescriptionDialog from './DescriptionDialog';

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
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function PeriodicTodoList() {
  const { t } = useTranslation();
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
              <TableCell>{t('periodicList.columns.todo')}</TableCell>
              <TableCell>{t('periodicList.columns.period')}</TableCell>
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
                      {t('periodicList.empty.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('periodicList.empty.subtitle')}
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

function PeriodicItem({ item }) {
  const { t } = useTranslation();
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
                <EditIcon fontSize="small" />
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
                <EventAvailableIcon fontSize="small" />
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

function parsePeriod(periodText, t) {
  const ALL_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const WEEKENDS = ['saturday', 'sunday'];

  const periodsParts = periodText.split(/[\s,]+/); // split by comma or space
  const dayIndices = periodsParts
    .map((day) => ALL_DAYS.indexOf(day))
    .filter((index) => index !== -1);

  const periodsSet = new Set(periodsParts);

  if (ALL_DAYS.every((d) => periodsSet.has(d)))
    return { type: 'daily', dayIndices: [], label: t('periodicChip.daily') };

  let label = [...periodsParts];
  if (WEEKDAYS.every((d) => periodsSet.has(d))) {
    label = label.filter((d) => !WEEKDAYS.includes(d));
    label.push('weekdays');
  }
  if (WEEKENDS.every((d) => periodsSet.has(d))) {
    label = label.filter((d) => !WEEKENDS.includes(d));
    label.push('weekends');
  }
  label = label.map((d) => t(`days.${d}`));

  if (dayIndices.length > 0) return { type: 'weekly', dayIndices, label: label.join(', ') };
  return { type: 'unknown' };
}

function PeriodicChip({ period }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const parsed = parsePeriod(period, t);
  const todayIndex = new Date().getDay();
  const isToday =
    parsed.type === 'daily' || (parsed.type === 'weekly' && parsed.dayIndices.includes(todayIndex));

  let label;
  if (parsed.type === 'daily') {
    label = t('periodicChip.daily');
  } else if (parsed.type === 'weekly') {
    label = isMobile
      ? period
          .split(', ')
          .map((day) => t(`days.${day}Abr`))
          .join(', ')
      : t('periodicChip.every', { label: parsed.label });
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

function PeriodicDialog({ open, onClose, onSubmit, initialData = {}, mode = 'add' }) {
  const { t } = useTranslation();
  const weekdayOptions = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
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
        <DialogTitle>
          {mode === 'add' ? t('periodicDialog.addTitle') : t('periodicDialog.editTitle')}
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            required
            label={t('periodicDialog.fields.title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth variant="standard">
            <InputLabel id={`period-label-${initialData?.id || 'new'}`}>
              {t('periodicDialog.fields.period')}
            </InputLabel>
            <Select
              labelId={`period-label-${initialData?.id || 'new'}`}
              multiple
              value={periods}
              renderValue={(selected) => parsePeriod(selected.join(', '), t).label}
              variant="standard"
            >
              {weekdayOptions.map((day) => (
                <MenuItem key={day} value={day} onClick={() => handleToggle(day)}>
                  <Checkbox checked={periods.includes(day)} />
                  <ListItemText primary={t(`days.${day}`)} />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{t('periodicDialog.helper')}</FormHelperText>
          </FormControl>
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

function AddPeriodicTodo() {
  const { t } = useTranslation();
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
        {t('addPeriodic')}
      </Button>

      <PeriodicDialog open={open} onClose={() => setOpen(false)} onSubmit={handleAdd} mode="add" />
    </>
  );
}

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

function ConfirmDeletePeriodicDialog({ open, onClose, onConfirm }) {
  const { t } = useTranslation();

  function handleRemove() {
    onClose();
    onConfirm();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('confirmDeletePeriodic.title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('confirmDeletePeriodic.message')}</Typography>
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

export default PeriodicTodoList;
