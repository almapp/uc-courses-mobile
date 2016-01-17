import {Component, Input, OnInit} from "angular2/core";
import {Item, Icon, List} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {Schedule, Block} from "../../models/schedule";
import {SchedulesProvider} from "../../providers/schedules";
import {ScheduleTable} from "../schedule-table/schedule-table";

@Component({
    selector: "section-view",
    templateUrl: "build/components/section-view/section-view.html",
    directives: [ScheduleTable, List, Item, Icon],
})
export class SectionView implements OnInit {
    @Input() section: Course;

    private schedules: Schedule[];
    private table: Block[][][];
    private mapping: Block[][][];

    private days = ["D", "L", "M", "W", "J", "V", "S"];
    private modules = [1, 2, 3, 4, 5, 6, 7, 8];

    constructor(private provider: CoursesProvider, private manager: SchedulesProvider) {
        // ...
    }

    ngOnInit() {
        this.manager.loadAll().then(schedules => this.schedules = schedules);
    }
}
