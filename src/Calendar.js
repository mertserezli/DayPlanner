/* eslint-disable react/destructuring-assignment */
import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { EditingState } from "@devexpress/dx-react-scheduler";
import {
    Scheduler,
    DayView,
    Appointments,
    DragDropProvider,
    EditRecurrenceMenu,
    AppointmentTooltip,
    AppointmentForm,
} from "@devexpress/dx-react-scheduler-material-ui";

import firebase from 'firebase/app';
import 'firebase/firestore';


if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyAR3BhiHFJEAgb-DjNF4UJqKyK3tg-TndI",
        authDomain: "dayplanner-f78c2.firebaseapp.com",
        databaseURL: "https://dayplanner-f78c2.firebaseio.com",
        projectId: "dayplanner-f78c2",
        storageBucket: "dayplanner-f78c2.appspot.com",
        messagingSenderId: "626321664189",
        appId: "1:626321664189:web:aed04b2f38bc2c7100efd4",
        measurementId: "G-DF7GXSKEK8"
    });
}

const firestore = firebase.firestore();

export default class Demo extends React.PureComponent {

    query = firestore.collection('Calendar').doc('date');

    constructor(props) {
        super(props);

        this.state = {
            data:[],
        };

        this.onCommitChanges = this.commitChanges.bind(this);
    }

    componentDidMount() {
        this.query.get().then((querySnapshot)=> {
            const data = querySnapshot.data().data.map(d=>{d.startDate = d.startDate.toDate(); d.endDate = d.endDate.toDate(); return d});
            this.setState({data: data});
        });
    }

    commitChanges({ added, changed, deleted }) {
        this.setState((state) => {
            let { data } = state;
            if (added) {
                const startingAddedId =
                    data.length > 0 ? data[data.length - 1].id + 1 : 0;
                data = [...data, { id: startingAddedId, ...added }];
            }
            if (changed) {
                data = data.map((appointment) =>
                    changed[appointment.id]
                        ? { ...appointment, ...changed[appointment.id] }
                        : appointment
                );
            }
            if (deleted !== undefined) {
                data = data.filter((appointment) => appointment.id !== deleted);
            }
            this.query.set({data});
            return { data };
        });
    }

    render() {
        const { data } = this.state;

        return (
            <Paper>
                <Scheduler data={data} height={800}>
                    <EditingState onCommitChanges={this.onCommitChanges} />
                    <EditRecurrenceMenu />
                    <DayView startDayHour={6} endDayHour={24}/>
                    <Appointments />
                    <AppointmentTooltip
                        showOpenButton
                        showDeleteButton
                    />
                    <DragDropProvider />
                    <AppointmentForm />
                </Scheduler>
            </Paper>
        );
    }
}
