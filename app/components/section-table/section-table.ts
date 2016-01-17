import {Component, Input, OnInit} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {Schedule, Block, DAYS, MODULES} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";

@Component({
    selector: "section-table",
    templateUrl: "build/components/section-table/section-table.html",
})
export class SectionTable implements OnInit {
    @Input() schedule: Schedule;
    @Input() section: Course;

    private table: Block[][][];
    private mapping: Block[][][];

    private days = DAYS;
    private modules = MODULES;

    constructor(private provider: CoursesProvider, private manager: SchedulesProvider) {
        // ...
    }

    ngOnInit() {
        this.table = this.modules.map(row => this.days.map(day => [])); // create matrix
        this.mapping = this.modules.map(row => this.days.map(day => [])); // create matrix

        this.schedule.week.forEach((day, i) => {
            day.forEach((blocks, j) => {
                blocks.forEach(block => {
                    // skip module '0'
                    if (block.NRC !== this.section.NRC) {
                        this.table[j - 1][i].push(block);
                    }
                });
            });
        });
        this.section.blocks.forEach(block => {
            this.mapping[block.block - 1][this.days.indexOf(block.day)].push(block);
        });
    }
}
