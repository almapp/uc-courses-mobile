import {Page, NavController, Platform, NavParams, Modal, Alert} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {Schedule, Block} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";
import {SectionView} from "../../components/section-view/section-view";
import {AddRemovePage} from "../add-remove/add-remove";
import {SectionListPage} from "../section-list/section-list";

@Page({
    templateUrl: "build/pages/section/section.html",
    directives: [SectionView],
})
export class SectionPage {
    private course: Course;
    private sections: Course[];
    private current: number;

    private schedules: Schedule[];
    private schedule: Schedule;

    constructor(
        private platform: Platform,
        private nav: NavController,
        private navParams: NavParams,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        this.course = this.navParams.get("course");

        this.provider.sections({ course: this.course }).then(sections => {
            sections = sections.sort((a, b) => a.section - b.section);
            this.current = sections.map(s => s.section).indexOf(this.course.section);
            this.sections = sections;
        });

        this.schedules = [];
        this.loadSchedules();

        this.manager.updated.subscribe(shc => {
            this.schedule = this.schedules[this.schedules.map(s => s.name).indexOf(shc.name)] = shc;
        });
        this.manager.new.subscribe(shc => {
            this.schedules.push(shc);
        });
        this.manager.removed.subscribe(shc => {
            this.schedules = this.schedules.filter(s => s.name !== shc.name);
            if (!this.schedule || shc.name === this.schedule.name) {
                this.schedule = this.schedules[0];
            }
        });
    }

    loadSchedules() {
        this.manager.loadAll().then(schedules => {
            if (schedules.length) {
                if (!this.schedule || schedules.map(s => s.name).indexOf(this.schedule.name) < 0) {
                    this.schedule = schedules[0];
                }
                this.schedules = schedules;
            }
        });
    }

    viewSections() {
        const modal = Modal.create(SectionListPage, { sections: this.sections });
        modal.onDismiss((section: Course) => {
            const index = this.sections.indexOf(section);
            if (index >= 0) {
                this.selectSection(index);
            }
        });
        this.nav.present(modal);
    }

    selectSection(section: number) {
        this.current = section;
        this.course = this.sections[this.current];
    }

    selectSchedule() {
        const alert = Alert.create({
            title: "Selecciona periodo",
            inputs: this.schedules.map((schedule, index) => ({
                type: "radio",
                value: String(index),
                label: schedule.name,
                checked: this.schedule.name === schedule.name,
            })),
            buttons: [
                "Cancelar",
                {
                    text: "Seleccionar",
                    handler: data => this.schedule = this.schedules[Number(data)],
                }
            ],
            enableBackdropDismiss: true,
        });
        this.nav.present(alert);
    }

    addSection(section: Course) {
        this.schedule.add(section);
        this.manager.save(this.schedule).then(() => {
            // done
        });
    }

    removeSection(section: Course) {
        this.schedule.remove(section);
        this.manager.save(this.schedule).then(() => {
            // done
        });
    }

    manage() {
        const modal = Modal.create(AddRemovePage, { course: this.course });
        this.nav.present(modal);
    }
}
