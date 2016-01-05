import {Component, Input, Output, EventEmitter, OnInit} from "angular2/core";
import {Segment, SegmentButton, Item, Icon, ActionSheet} from "ionic-framework/ionic";

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
    events: ["deleted"],
    directives: [ScheduleBlock, Segment, SegmentButton, Item, Icon],
})
export class ScheduleView implements OnInit {
    @Input() schedule: Schedule;
    @Output() deleted = new EventEmitter();

    current: string;
    days: string[] = DAYS;

    constructor(private actionSheet: ActionSheet) {
        this.current = this.today;
    }

    get today(): string {
        return WEEKDAYS[new Date().getDay()];
    }

    selectDay(day: string) {
        this.current = day;
    }

    options() {
        this.actionSheet.open({
            titleText: `Optiones para horario '${this.schedule.name}'`,
            buttons: [
                { text: "Compartir" },
            ],
            cancelText: "Cancelar",
            destructiveText: "Borrar",
            buttonClicked: (index) => {
                return true;
            },
            destructiveButtonClicked: () => {
                this.deleted.emit(null);
                return true;
            },
        });
    }
}
