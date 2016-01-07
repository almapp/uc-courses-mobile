import {Page, NavController, Modal, ActionSheet, NavParams} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider, FullSearchQuery, Period, Campus} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {CourseItem} from "../../components/course-item/course-item";

import {SectionPage} from "../section/section";
import {AddRemovePage} from "../add-remove/add-remove";

@Page({
    templateUrl: "build/pages/section-list/section-list.html",
    directives: [CourseItem],
})
export class SectionListPage {
    private sections: Course[];
    private course: Course;

    constructor(
        private modal: Modal,
        private nav: NavController,
        private params: NavParams,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        this.sections = this.params.get("sections");
        this.course = this.sections[0];
    }

    addToSchedule(course: Course) {
        this.modal.open(AddRemovePage, {
            course: course
        });
    }

    selectCourse(course: Course) {

    }

    cancel() {
        this.close();
    }

    close() {
        const modal = this.modal.get(null) as any;
        if (modal) {
            modal.close();
        }
    }
}
