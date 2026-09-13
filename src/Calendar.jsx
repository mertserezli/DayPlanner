import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

import {
  addCalendarItem,
  getCalendarItemsQuery,
  removeCalendarItem,
  updateCalendarItem,
} from './Firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

import {
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function toLocalISOString(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function Calendar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [calendarItems] = useCollection(getCalendarItemsQuery());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    details: '',
  });

  const events = useMemo(() => {
    if (!calendarItems) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return calendarItems.docs
      .map((docItem) => {
        const data = docItem.data();
        const start = data.startDate?.toDate ? data.startDate.toDate() : new Date(data.startDate);
        const end = data.endDate?.toDate ? data.endDate.toDate() : new Date(data.endDate);

        return {
          id: docItem.id,
          title: data.title || data.name || '',
          start,
          end,
          extendedProps: {
            details: data.details || data.notes || data.description || '',
          },
        };
      })
      .filter((item) => {
        return item.start && !isNaN(item.start.getTime()) && today <= item.start;
      });
  }, [calendarItems]);

  const handleEventDrop = (info) => {
    updateCalendarItem({
      [info.event.id]: {
        startDate: info.event.start,
        endDate: info.event.end || new Date(info.event.start.getTime() + 30 * 60 * 1000),
      },
    });
  };

  const handleEventResize = (info) => {
    updateCalendarItem({
      [info.event.id]: {
        startDate: info.event.start,
        endDate: info.event.end,
      },
    });
  };

  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    setModalMode('add');
    setSelectedEventId(null);
    setFormData({
      title: '',
      startDate: toLocalISOString(selectInfo.start),
      endDate: toLocalISOString(selectInfo.end),
      details: '',
    });
    setDialogOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setModalMode('edit');
    setSelectedEventId(clickInfo.event.id);
    setFormData({
      title: clickInfo.event.title,
      startDate: toLocalISOString(clickInfo.event.start),
      endDate: toLocalISOString(
        clickInfo.event.end || new Date(clickInfo.event.start.getTime() + 30 * 60 * 1000)
      ),
      details: clickInfo.event.extendedProps?.details || '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEventId(null);
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      details: '',
    });
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.startDate || !formData.endDate) return;

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (modalMode === 'add') {
      addCalendarItem({
        title: formData.title.trim(),
        startDate,
        endDate,
        notes: formData.details.trim(),
      });
    } else if (modalMode === 'edit' && selectedEventId) {
      updateCalendarItem({
        [selectedEventId]: {
          title: formData.title.trim(),
          startDate,
          endDate,
          notes: formData.details.trim(),
        },
      });
    }

    handleCloseDialog();
  };

  const handleDelete = () => {
    if (selectedEventId) {
      removeCalendarItem(selectedEventId);
    }
    handleCloseDialog();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: {
          xs: 'calc(100dvh - 152px)',
          md: 'calc(100vh - 84px)',
        },
        minHeight: '520px',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          '& .fc': {
            height: '100%',
            '--fc-border-color': theme.palette.divider,
            '--fc-page-bg-color': 'transparent',
            '--fc-neutral-bg-color': theme.palette.action.hover,
            '--fc-neutral-text-color': theme.palette.text.secondary,
            '--fc-today-bg-color': theme.palette.action.selected,
            '--fc-event-bg-color': theme.palette.primary.main,
            '--fc-event-border-color': theme.palette.primary.dark,
            '--fc-event-text-color': theme.palette.primary.contrastText,
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.text.primary,
          },
          '& .fc .fc-toolbar': {
            mb: 1.5,
            flexWrap: 'wrap',
            gap: 1,
          },
          '& .fc .fc-toolbar-title': {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
          },
          '& .fc .fc-button': {
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '8px',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              borderColor: theme.palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
              borderColor: 'transparent',
              color: theme.palette.action.disabled,
            },
            '&.fc-button-active': {
              backgroundColor: theme.palette.primary.dark,
              borderColor: theme.palette.primary.dark,
            },
          },
          '& .fc-theme-standard td, & .fc-theme-standard th': {
            borderColor: theme.palette.divider,
          },
          '& .fc-col-header-cell-cushion': {
            color: theme.palette.text.primary,
            fontWeight: 600,
            textDecoration: 'none',
            padding: '8px',
          },
          '& .fc-timegrid-slot-label-cushion': {
            color: theme.palette.text.secondary,
            textDecoration: 'none',
            fontSize: '0.85rem',
          },
          '& .fc-event': {
            borderRadius: '6px',
            padding: '2px 4px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
            },
          },
        }}
      >
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          locales={allLocales}
          locale={i18n.language}
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={false}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="100%"
          expandRows={true}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {modalMode === 'add'
            ? t('calendar.details', { defaultValue: 'New Appointment' })
            : t('calendar.open', { defaultValue: 'Edit Appointment' })}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label={t('calendar.title', { defaultValue: 'Title' })}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label={t('calendar.startDate', { defaultValue: 'Start Date' })}
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label={t('calendar.endDate', { defaultValue: 'End Date' })}
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label={t('calendar.details', { defaultValue: 'Details' })}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {modalMode === 'edit' && (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              sx={{ mr: 'auto' }}
            >
              {t('calendar.delete', { defaultValue: 'Delete' })}
            </Button>
          )}
          <Button onClick={handleCloseDialog}>
            {t('calendar.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.title.trim() || !formData.startDate || !formData.endDate}
          >
            {t('calendar.save', { defaultValue: 'Save' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
