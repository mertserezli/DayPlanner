/* eslint-disable react/destructuring-assignment */
import * as React from "react";
import Paper from '@mui/material/Paper';
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

import {firestore} from "./Firebase";
import {
    onSnapshot,
    doc,
    updateDoc,
} from "firebase/firestore";

export default class Demo extends React.PureComponent {

    constructor(props) {
        super(props);
        const user = props.user;
        this.query = doc(firestore,'Users', user.uid, 'Calendar', 'date');
        this.state = {
            data:[],
        };

        this.commitChanges = this.commitChanges.bind(this);
        this.importJSON = this.importJSON.bind(this);
    }

    componentDidMount() {

        onSnapshot(this.query, docSnapshot => {
            let data = [];
            if(docSnapshot.data()) {
                data = docSnapshot.data().data.map(d=>{d.startDate = d.startDate.toDate(); d.endDate = d.endDate.toDate(); return d});
            }
            const today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            data = data.filter(d => today < d.startDate);
            this.setState({data: data});
        }, err => {
            console.log(`Encountered error: ${err}`);
        });

    }

    commitChanges({ added, changed, deleted }) {
        let { data } = this.state;
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
        updateDoc(this.query, {data});
    }

    exportToJson(object){
        let filename = "export.json";
        let contentType = "application/json;charset=utf-8;";
        object = object.map(o => {
            o.startDate = o.startDate.toString();
            o.endDate = o.endDate.toString();
            return o
        });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            let blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(object)))], { type: contentType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            let a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(object));
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    importJSON(e){
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        let curId = Math.max(...this.state.data.map(d => d.id)) + 1;
        fileReader.onload = e => {
            let appointmentsToImport = JSON.parse(e.target.result);
            appointmentsToImport.forEach(a => {
                a.startDate = new Date(a.startDate);
                a.endDate = new Date(a.endDate);

                const curStart = new Date();
                curStart.setHours(a.startDate.getHours());
                curStart.setMinutes(a.startDate.getMinutes());
                a.startDate = curStart;

                const curEnd = new Date();
                curEnd.setHours(a.endDate.getHours());
                curEnd.setMinutes(a.endDate.getMinutes());
                a.endDate = curEnd;

                a.id = curId;
                curId++;
            });
            appointmentsToImport = [...appointmentsToImport, ...this.state.data];
            this.query.set({data:appointmentsToImport});
        };
    };

    render() {
        const { data } = this.state;

        return (
            <>
                <Paper>
                    <Scheduler data={data} height={800}>
                        <EditingState onCommitChanges={this.commitChanges} />
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
                <button onClick={() => this.exportToJson(this.state.data)}>
                    Export
                </button>
                <label htmlFor="avatar">Import:</label>
                <input type="file" id="avatar" name="import" accept=".json" onChange={this.importJSON}/>
            </>
        );
    }
}
