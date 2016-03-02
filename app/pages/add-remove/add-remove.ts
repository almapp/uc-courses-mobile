import {Page, Platform, ViewController, NavController, NavParams} from "ionic-angular";

import {Course} from "../../models/course";
import {Schedule} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";

@Page({
    templateUrl: "build/pages/add-remove/add-remove.html",
})
export class AddRemovePage {
    items: { schedule: Schedule, checked: boolean }[];
    course: Course;
    title: string;

    constructor(
        private platform: Platform,
        private nav: NavController,
        private view: ViewController,
        private params: NavParams,
        private manager: SchedulesProvider) {

        this.course = this.params.get("course");
        this.title = `${this.course.initials}-${this.course.section}`;
        this.manager.loadAll().then(results => {
            this.items = results.map(schedule => ({
                schedule: schedule,
                checked: schedule.has(this.course),
            }));
        });
    }

    save() {
        const changed: Schedule[] = this.items.map(item => {
            return (item.checked) ? item.schedule.add(this.course) : item.schedule.remove(this.course);
        });
        this.title = "Guardando...";
        Promise.all(changed.map(sch => this.manager.save(sch))).then(() => {
            this.title = "Guardado";
            this.close();
        });
    }

    cancel() {
        this.close();
    }

    close() {
        this.view.dismiss(null);
    }
}
