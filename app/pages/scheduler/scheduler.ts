import {Page, NavController, Platform, Alert, ActionSheet, Modal} from "ionic-angular";

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
    private schedules: Schedule[] = [];

    constructor(
        private platform: Platform,
        private nav: NavController,
        private manager: SchedulesProvider) {

        this.manager.source().subscribe(schedules => this.schedules = schedules);
    }

    seeCourses(schedule: Schedule) {
        const modal = Modal.create(SectionListPage, { sections: schedule.iterableCourses });
        modal.onDismiss((section: Course) => {
            if (section) { this.seeCourse(section); }
        });
        this.nav.present(modal);
    }

    new() {
        const alert = Alert.create({
            title: "Nuevo horario",
            subTitle: "Ingresa un nombre para este",
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
        const order = (this.schedules[0]) ? this.schedules[0].position + 1 : 0;
        return this.manager.create(name, order);
    }

    delete(schedule: Schedule) {
        this.manager.delete(schedule);
    }

    clone(schedule: Schedule) {
        this.manager.save(this.manager.clone(schedule, `Copia de ${schedule.name}`));
    }

    select(block: Block, schedule: Schedule) {
        this.seeCourse(schedule.course(block.NRC));
    }

    seeCourse(course: Course) {
        this.nav.push(SectionPage, { course: course });
    }

    options(schedule: Schedule) {
        const sheet = ActionSheet.create({
            title: `Optiones para horario '${schedule.name}'`,
            buttons: [
                {
                    text: "Crear copia",
                    handler: () => this.clone(schedule),
                },
                {
                    text: "Borrar",
                    role: "destructive",
                    handler: () => this.delete(schedule),
                },
                {
                    text: "Cancelar",
                    role: "cancel",
                },
            ],
        });
        this.nav.present(sheet);
    }
}
