import {Component, Input} from "angular2/core";
import {Segment, SegmentButton, Item} from "ionic-framework/ionic";

import {Course, DAYS} from "../../models/course";
import {Schedule} from "../../models/schedule";
import {CoursesProvider} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {ScheduleBlock} from "../schedule-block/schedule-block";

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
    directives: [ScheduleBlock, Segment, SegmentButton, Item],
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
