import {Component, Input} from "angular2/core";
import {Segment, SegmentButton} from "ionic-framework/ionic";

import {Course, DAYS} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {SchedulesProvider, Schedule} from "../../providers/schedules";

const WEEKDAYS = [
    "D",
    "L",
    "M",
    "W",
    "J",
    "V",
    "S",
];

@Component({
    selector: "schedule-view",
    templateUrl: "build/components/schedule-view/schedule-view.html",
    directives: [Segment, SegmentButton],
    providers: [CoursesProvider, SchedulesProvider],
})
export class ScheduleView {
    @Input() schedule: Schedule;

    current: string;
    days: string[] = DAYS;

    constructor(private provider: CoursesProvider, private manager: SchedulesProvider) {
        this.current = this.today;
    }

    get today(): string {
        return WEEKDAYS[new Date().getDay()];
    }

    selectDay(day: string) {
        this.current = day;
    }
}
