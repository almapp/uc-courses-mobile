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
    @Output() deleted = new EventEmitter<Schedule>();
    @Output() select = new EventEmitter<Block>();

    current: string;
    days: string[] = DAYS;

    constructor(private actionSheet: ActionSheet, private manager: SchedulesProvider) {
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

    selectDay(day: string) {
        this.current = day;
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
                this.deleted.emit(this.schedule);
                return true;
            },
        });
    }

    selected(block: Block) {
        this.select.emit(block);
    }
}
