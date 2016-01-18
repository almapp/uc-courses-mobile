import {Page, NavController, Modal, ViewController, ActionSheet, NavParams} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {CourseItem} from "../../components/course-item/course-item";
import {ScheduleTable} from "../../components/schedule-table/schedule-table";

import {SectionPage} from "../section/section";
import {AddRemovePage} from "../add-remove/add-remove";

@Page({
    templateUrl: "build/pages/section-list/section-list.html",
    directives: [CourseItem, ScheduleTable],
})
export class SectionListPage {
    private sections: Course[];
    private course: Course;

    constructor(
        private nav: NavController,
        private view: ViewController,
        private params: NavParams,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        this.sections = this.params.get("sections");
        this.course = this.sections[0];
    }

    addToSchedule(course: Course) {
        const modal = Modal.create(AddRemovePage, { course: course });
        this.nav.present(modal);
    }

    selectCourse(course: Course) {
        this.close(course);
    }

    cancel() {
        this.close();
    }

    close(section?: Course) {
        this.view.dismiss(section);
    }
}
