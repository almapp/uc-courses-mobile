import {Page, NavController} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {CoursesProvider, DAYS, MODULES} from "../../providers/courses";
import {CourseItem} from "../../components/course-item/course-item";

@Page({
    templateUrl: "build/pages/scheduler/scheduler.html",
    directives: [CourseItem],
    providers: [CoursesProvider],
})
export class SchedulerPage {
    days: string[] = DAYS;

    constructor(
        private provider: CoursesProvider,
        private nav: NavController) {


    }
}
