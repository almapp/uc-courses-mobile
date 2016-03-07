import {Component, Input, OnChanges} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {Schedule, Block, DAYS, MODULES} from "../../models/schedule";

@Component({
    selector: "schedule-table",
    templateUrl: "build/components/schedule-table/schedule-table.html",
})
export class ScheduleTable implements OnChanges {
    @Input() schedule: Schedule;
    @Input() highlight: Course[] = [];

    private table: Block[][][];
    private mapping: Block[][][];

    private days = DAYS;
    private modules = MODULES;

    constructor(private provider: CoursesProvider) {
        // ...
    }

    ngOnChanges(changeRecord) {
        this.table = this.modules.map(row => this.days.map(day => [])); // create matrix
        this.mapping = this.modules.map(row => this.days.map(day => [])); // create matrix

        if (this.schedule) {
            this.schedule.week.forEach((day, i) => {
                (day || []).forEach((blocks, j) => {
                    (blocks || []).forEach(block => {
                        if (this.highlight.every(section => block.NRC !== section.NRC)) {
                            // skip module '0'
                            this.table[j - 1][i].push(block);
                        }
                    });
                });
            });
        }
        this.highlight.forEach(section => section.blocks.forEach(block => {
            this.mapping[block.block - 1][this.days.indexOf(block.day)].push(block);
        }));
    }
}
