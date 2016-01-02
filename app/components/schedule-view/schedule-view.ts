import {Component} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider, Period, Campus} from "../../providers/courses";
import {SchedulesProvider, Schedule} from "../../providers/schedules";

@Component({
    selector: "schedule-view",
    templateUrl: "build/components/schedule-view/schedule-view.html",
    directives: [],
    providers: [CoursesProvider, SchedulesProvider],
})
export class ScheduleView {
    constructor(private provider: CoursesProvider, private manager: SchedulesProvider) {
        // ...
    }
}
