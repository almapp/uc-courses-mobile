import {Page, Platform, Modal, NavController, NavParams} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {Schedule} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";

@Page({
    templateUrl: "build/pages/add-remove/add-remove.html",
})
export class AddRemovePage {
    items: { schedule: Schedule, checked: boolean }[];
    checkeds: boolean[];
    course: Course;
    title: string;

    constructor(
        private platform: Platform,
        private modal: Modal,
        private nav: NavController,
        private params: NavParams,
        private manager: SchedulesProvider) {

        this.course = this.params.get("course");
        this.title = `${this.course.initials}-${this.course.section}`;
        this.manager.loadAll().then(results => {
            this.items = results.map(schedule => {
                return {
                    schedule: schedule,
                    checked: schedule.has(this.course),
                };
            });
        });
    }

    save() {
        console.log(this.checkeds);
        const changed: Schedule[] = this.items.map(item => {
            if (item.checked) {
                item.schedule.add(this.course);
            } else {
                item.schedule.remove(this.course);
            }
            return item.schedule;
        });
        console.log(JSON.stringify(changed));
        this.title = "Guardando...";
        Promise.all(changed.map(sch => this.manager.save(sch))).then(() => {
            this.title = "Guardado";
            console.log("Guardado");
            this.close();
        });
    }

    cancel() {
        this.close();
    }

    close() {
        const modal = this.modal.get() as any;
        if (modal) {
            modal.close();
        }
    }
}
