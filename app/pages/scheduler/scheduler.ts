import {Page, NavController, Platform, Popup} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {Schedule} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";
import {ScheduleView} from "../../components/schedule-view/schedule-view";

@Page({
    templateUrl: "build/pages/scheduler/scheduler.html",
    directives: [ScheduleView],
    providers: [SchedulesProvider],
})
export class SchedulerPage {
    schedules: Schedule[];

    constructor(
        private platform: Platform,
        private nav: NavController,
        private popup: Popup,
        private manager: SchedulesProvider) {

        this.loadSchedules().then(results => {
            if (results.length == 0) {
                return this.setup();
            }
        });
    }

    setup(): Promise<Schedule> {
        return this.manager.create("Propio", 0).then(schedule => {
            this.schedules = [schedule];
        });
    }

    loadSchedules(): Promise<Schedule[]> {
        return this.manager.loadAll().then(schedules => {
            return this.schedules = schedules.sort((a, b) => a.position - b.position);
        });
    }

    newScheduler() {
        return this.popup.prompt({
            title: "Nuevo horario",
            template: "Ingresa un nombre para este",
            inputPlaceholder: "Nombre",
            okText: "Guardar",
            okType: "secondary",
        }).then((name: string) => {
            const repeated = this.schedules.some(sch => {
                return sch.name === name;
            });
            if (repeated) {
                throw new Error("Horario con nombre repetido");
            } else {
                return name;
            }
        }).then(name => {
            const order = (this.schedules[0]) ? this.schedules[0].position + 1 : 0;
            return this.manager.create(name, order);
        }).then(schedule => {
            this.schedules.push(schedule);
        }).catch((err: Error) => {
            // FIXME: Error: nav controller actively transitioning
            // return this.alertRepeatedSchedule(err.name);
        });
    }

    deleteSchedule(schedule: Schedule) {
        this.manager.delete(schedule).then(() => {
            return this.schedules = this.schedules.filter(s => s.name !== schedule.name);
        });
    }

    alertRepeatedSchedule(body: string) {
        return this.popup.alert({
            title: "Problema:",
            template: body,
        });
    }
}
