import React, { useCallback } from 'react';
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

import {
  addCalendarItem,
  getCalendarItemsQuery,
  removeCalendarItem,
  updateCalendarItem,
} from './Firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function Calendar() {
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
      <Scheduler data={items} height={'100%'}>
        <EditingState onCommitChanges={commitChanges} />
        <EditRecurrenceMenu />
        <DayView startDayHour={6} endDayHour={24} />
        <Appointments />
        <AppointmentTooltip showOpenButton showDeleteButton />
        <DragDropProvider />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  );
}
