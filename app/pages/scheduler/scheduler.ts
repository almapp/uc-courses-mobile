import {Page, NavController, Platform, Alert, ActionSheet, Modal} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {Schedule, Block} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";
import {ScheduleView} from "../../components/schedule-view/schedule-view";
import {SectionPage} from "../section/section";
import {SectionListPage} from "../section-list/section-list";

@Page({
    templateUrl: "build/pages/scheduler/scheduler.html",
    directives: [ScheduleView],
})
export class SchedulerPage {
    schedules: Schedule[];

    constructor(
        private platform: Platform,
        private nav: NavController,
        private manager: SchedulesProvider) {

        this.schedules = null;
        this.load().then(results => {
            if (results.length == 0) {
                return this.setup();
            }
        });
    }

    setup(): Promise<Schedule[]> {
        return this.manager.create("Propio", 0).then(schedule => {
            return this.schedules = [schedule];
        });
    }

    load(): Promise<Schedule[]> {
        return this.manager.loadAll().then(schedules => {
            return this.schedules = schedules.sort((a, b) => a.position - b.position);
        });
    }

    seeCourses(schedule: Schedule) {
        const modal = Modal.create(SectionListPage, { sections: schedule.courses });
        modal.onDismiss((section: Course) => {
            this.seeCourse(section);
        });
        this.nav.present(modal);
    }

    new() {
        const alert = Alert.create({
            title: "Nuevo horario",
            body: "Ingresa un nombre para este",
            inputs: [
                { name: "name", placeholder: "Nombre" },
            ],
            buttons: [
                { text: "Cancelar" },
                { text: "Guardar", handler: (values) => this.create(values.name) },
            ],
        });
        this.nav.present(alert);
    }

    create(name: string) {
        const repeated = this.schedules.some(sch => {
            return sch.name === name;
        });
        if (repeated) {
            this.alertRepeated(name);
        } else {
            const order = (this.schedules[0]) ? this.schedules[0].position + 1 : 0;
            return this.manager.create(name, order).then(schedule => this.schedules.push(schedule));
        }
    }

    delete(schedule: Schedule) {
        this.manager.delete(schedule).then(() => {
            return this.schedules = this.schedules.filter(s => s.name !== schedule.name);
        });
    }

    select(block: Block, schedule: Schedule) {
        this.seeCourse(schedule.course(block.NRC));
    }

    seeCourse(course: Course) {
        this.nav.push(SectionPage, {
            course: course,
        }, { direction: "forward" }, undefined);
    }

    options(schedule: Schedule) {
        const sheet = ActionSheet.create({
            title: `Optiones para horario '${schedule.name}'`,
            buttons: [
                {
                    text: "Borrar",
                    style: "destructive",
                    handler: () => this.delete(schedule),
                },
                {
                    text: "Cancelar",
                    style: "cancel",
                },
            ],
        });
        this.nav.present(sheet);
    }

    alertRepeated(name: string) {
        const alert = Alert.create({
            title: "Ups!",
            body: "Ya existe un horario con ese nombre, intenta con otro :)",
            buttons: ["Ok"],
        });
        this.nav.present(alert);
    }
}
