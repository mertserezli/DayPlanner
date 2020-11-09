/* eslint-disable react/destructuring-assignment */
import * as React from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
    Scheduler,
    DayView,
    Appointments,
    DragDropProvider,
    EditRecurrenceMenu,
    AllDayPanel,
    AppointmentTooltip,
    AppointmentForm,
} from "@devexpress/dx-react-scheduler-material-ui";

export default class Demo extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data:[],
        };

        this.onCommitChanges = this.commitChanges.bind(this);
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
            return { data };
        });
    }

    render() {
        const { data } = this.state;

        return (
            <div style={{width:"80%"}}>
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
            </div>
        );
    }
}
