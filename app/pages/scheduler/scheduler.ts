import {Page, NavController} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {SchedulesProvider, Schedule} from "../../providers/schedules";
import {ScheduleView} from "../../components/schedule-view/schedule-view";

@Page({
    templateUrl: "build/pages/scheduler/scheduler.html",
    directives: [ScheduleView],
    providers: [SchedulesProvider],
})
export class SchedulerPage {
    schedules: Schedule[];

    constructor(
        private manager: SchedulesProvider,
        private nav: NavController) {

        this.manager.load().then(schedules => {
            this.schedules = schedules.sort((a, b) => a.position - b.position);
        });
    }
}
