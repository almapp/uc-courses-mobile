import {Component, Input, Output, EventEmitter} from "angular2/core";
import {Item, Icon, List, Button} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {Schedule} from "../../models/schedule";
import {CoursesProvider} from "../../providers/courses";
import {ScheduleTable} from "../schedule-table/schedule-table";

@Component({
    selector: "section-view",
    templateUrl: "build/components/section-view/section-view.html",
    directives: [ScheduleTable, List, Item, Icon, Button],
})
export class SectionView {
    @Input() schedule: Schedule;
    @Input() section: Course;

    @Output() selectSchedule = new EventEmitter<void>();
    @Output() add = new EventEmitter<Course>();
    @Output() remove = new EventEmitter<Course>();

    constructor(private provider: CoursesProvider) {
        // ...
    }
}
