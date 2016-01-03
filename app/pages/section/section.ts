import {Page, NavController, NavParams} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider, FullSearchQuery, Period, Campus} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";

@Page({
    templateUrl: "build/pages/section/section.html",
    providers: [CoursesProvider, SchedulesProvider],
})
export class SectionPage {
    course: Course;
    sections: Promise<Course[]>;
    current: number;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        this.course = this.navParams.data;
        this.current = this.course.section;
        this.sections = this.provider.sections({ course: this.course });
    }
}
