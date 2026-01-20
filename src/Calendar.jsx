import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

import {
  addCalendarItem,
  getCalendarItemsQuery,
  removeCalendarItem,
  updateCalendarItem,
} from './Firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

import Paper from '@mui/material/Paper';
import {
  Scheduler,
  DayView,
  Appointments,
  DragDropProvider,
  EditRecurrenceMenu,
  AppointmentTooltip,
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import { EditingState } from '@devexpress/dx-react-scheduler';

export default function Calendar() {
  const { t } = useTranslation();
  const [calendarItems] = useCollection(getCalendarItemsQuery());

  const items = calendarItems
    ? calendarItems.docs
        .map((item) => ({
          ...item.data(),
          id: item.id,
          startDate: item.data().startDate.toDate(),
          endDate: item.data().endDate.toDate(),
        }))
        .filter((d) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return today < d.startDate;
        })
    : [];

  const commitChanges = useCallback(({ added, changed, deleted }) => {
    if (added) {
      addCalendarItem(added);
    }
    if (changed) {
      updateCalendarItem(changed);
    }
    if (deleted !== undefined) {
      removeCalendarItem(deleted);
    }
  }, []);

  return (
    <Paper style={{ height: '80vh', overflow: 'auto' }}>
      <Scheduler data={items} height={'100%'} locale={i18n.language}>
        <EditingState onCommitChanges={commitChanges} />
        <EditRecurrenceMenu messages={{ deleteButton: t('calendar.deleteRecurring') }} />
        <DayView startDayHour={6} endDayHour={24} displayName={t('calendar.dayView')} />
        <Appointments />
        <AppointmentTooltip
          showOpenButton
          showDeleteButton
          messages={{
            openButton: t('calendar.open'),
            deleteButton: t('calendar.delete'),
          }}
        />
        <DragDropProvider />
        <AppointmentForm
          messages={{
            detailsLabel: t('calendar.details'),
            commitCommand: t('calendar.save'),
            discardButton: t('calendar.cancel'),
            titleLabel: t('calendar.title'),
            startDateLabel: t('calendar.startDate'),
            endDateLabel: t('calendar.endDate'),
          }}
        />
      </Scheduler>
    </Paper>
  );
}
