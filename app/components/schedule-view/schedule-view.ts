import {Component, Input, Output, EventEmitter, OnInit} from "angular2/core";
import {Segment, SegmentButton, Item, Icon, ActionSheet} from "ionic-framework/ionic";

import {DAYS} from "../../models/course";
import {Schedule, Block} from "../../models/schedule";
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

const NAMES = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
];

@Component({
    selector: "schedule-view",
    templateUrl: "build/components/schedule-view/schedule-view.html",
    directives: [ScheduleBlock, Segment, SegmentButton, Item, Icon],
})
export class ScheduleView implements OnInit {
    @Input() schedule: Schedule;
    @Output() options = new EventEmitter<Schedule>();
    @Output() select = new EventEmitter<Block>();

    current: string;
    days: string[] = DAYS;

    constructor(private manager: SchedulesProvider) {
        this.current = this.today;
    }

    ngOnInit(){
        this.manager.updated.subscribe(schedule => {
            if (this.schedule.name === schedule.name) { this.schedule = schedule; }
        });
    }

    get today(): string {
        return WEEKDAYS[new Date().getDay()];
    }

    isBusy(day: string): boolean {
        const dayBlocks = this.schedule.week[day].filter(Boolean);
        return dayBlocks.some(blocks => {
            return blocks.length > 0;
        });
    }

    name(day: string): string {
        return NAMES[WEEKDAYS.indexOf(day)];
    }

    click() {
        this.options.emit(this.schedule);
    }

    selected(block: Block) {
        this.select.emit(block);
    }
}
