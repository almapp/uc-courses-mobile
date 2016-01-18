import {Component, Input} from "angular2/core";
import {Item, Icon, List} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {Schedule} from "../../models/schedule";
import {ScheduleTable} from "../schedule-table/schedule-table";

@Component({
    selector: "section-view",
    templateUrl: "build/components/section-view/section-view.html",
    directives: [ScheduleTable, List, Item, Icon],
})
export class SectionView {
    @Input() schedule: Schedule;
    @Input() section: Course;
}
