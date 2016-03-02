import {Component, Input, Output, EventEmitter, OnChanges} from "angular2/core";
import {Segment, SegmentButton, Item, Icon, ActionSheet, Button} from "ionic-angular";

import {Schedule, Block} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";
import {ScheduleBlock} from "../schedule-block/schedule-block";

@Component({
    selector: "schedule-view",
    templateUrl: "build/components/schedule-view/schedule-view.html",
    directives: [ScheduleBlock, Segment, SegmentButton, Item, Icon, Button],
})
export class ScheduleView implements OnChanges {
    @Input() schedule: Schedule;

    @Output() options = new EventEmitter<Schedule>();
    @Output() select = new EventEmitter<Block>();
    @Output() courses = new EventEmitter<void>();

    current: number;
    days: string[];
    names: string[];

    constructor(private manager: SchedulesProvider) {
        this.days = [
            // "D", // add +1 offset
            "L",
            "M",
            "W",
            "J",
            "V",
            "S",
        ];
        this.names = [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
        ];
        this.current = this.today;
    }

    ngOnChanges(changeRecord) {
        this.manager.updated.subscribe(schedule => {
            if (this.schedule.name === schedule.name) { this.schedule = schedule; }
        });
    }

    get today(): number {
        return new Date().getDay();
    }

    isBusy(day: number): boolean {
        const schedule = this.schedule.week[day] || [];
        return schedule.some(blocks => {
            return blocks.length > 0;
        });
    }

    click() {
        this.options.emit(this.schedule);
    }

    selected(block: Block) {
        this.select.emit(block);
    }
}
