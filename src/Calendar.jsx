import React, { useState, useEffect, useCallback } from 'react';
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
import { onSnapshot } from 'firebase/firestore';

export default function Calendar() {
  const query = getCalendarItemsQuery();
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        let items = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            startDate: d.startDate.toDate(),
            endDate: d.endDate.toDate(),
          };
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        items = items.filter((d) => today < d.startDate);

        setData(items);
      },
      (err) => {
        console.error('Encountered error:', err);
      }
    );

    return () => unsubscribe();
  }, [query]);

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
    <Paper>
      <Scheduler data={data} height={800}>
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
