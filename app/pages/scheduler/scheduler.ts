import {Page, NavController} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {DAYS, MODULES} from "../../providers/courses";
import {SchedulesProvider, Schedule} from "../../providers/schedules";
import {CourseItem} from "../../components/course-item/course-item";
import {ScheduleView} from "../../components/schedule-view/schedule-view";

@Page({
    templateUrl: "build/pages/scheduler/scheduler.html",
    directives: [CourseItem],
    providers: [SchedulesProvider],
})
export class SchedulerPage {
    days: string[] = DAYS;
    current: string;
    schedules: Schedule[];

    static WEEKDAYS = [
        "D",
        "L",
        "M",
        "W",
        "J",
        "V",
        "S",
    ];

    constructor(
        private manager: SchedulesProvider,
        private nav: NavController) {

        const today = new Date();
        this.current = this.today;

        this.manager.load().then(schedules => {
            this.schedules = schedules.sort((a, b) => a.position - b.position);
        });
    }

    get today(): string {
        return SchedulerPage.WEEKDAYS[new Date().getDay()];
    }

    selectDay(day: any) {
        this.current = day;
    }
}
