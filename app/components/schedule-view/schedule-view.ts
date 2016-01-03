import {Component, Input} from "angular2/core";
import {Segment, SegmentButton, Item} from "ionic-framework/ionic";

import {DAYS} from "../../models/course";
import {Schedule} from "../../models/schedule";
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
})
export class ScheduleView {
    @Input() schedule: Schedule;

    current: string;
    days: string[] = DAYS;

    constructor() {
        this.current = this.today;
    }

    get today(): string {
        return WEEKDAYS[new Date().getDay()];
    }

    selectDay(day: string) {
        this.current = day;
    }
}
