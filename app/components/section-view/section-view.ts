import {Component, Input, OnInit} from "angular2/core";
import {Item, Icon, List} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {Schedule, Block} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";
import {SectionTable} from "../section-table/section-table";

@Component({
    selector: "section-view",
    templateUrl: "build/components/section-view/section-view.html",
    directives: [SectionTable, List, Item, Icon],
})
export class SectionView implements OnInit {
    @Input() section: Course;

    private schedule: Schedule;
    private table: Block[][][];
    private mapping: Block[][][];

    private days = ["D", "L", "M", "W", "J", "V", "S"];
    private modules = [1, 2, 3, 4, 5, 6, 7, 8];

    constructor(private provider: CoursesProvider, private manager: SchedulesProvider) {
        // ...
    }

    ngOnInit() {
        this.manager.loadAll().then(result => {
            this.schedule = result[0];

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
        });
    }
}
