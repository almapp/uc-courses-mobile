import {Component, Input, Output, EventEmitter, OnInit} from "angular2/core";
import {Item, ItemSliding} from "ionic-angular";

import {Course, ScheduleSchema} from "../../models/course";

@Component({
    selector: "course-item",
    templateUrl: "build/components/course-item/course-item.html",
    directives: [Item, ItemSliding],
})
export class CourseItem implements OnInit {
    @Input() course: Course;
    @Output() select = new EventEmitter();
    @Output() add = new EventEmitter();

    schedule: ScheduleSchema[];

    ngOnInit() {
        this.schedule = this.course.schedule;
    }

    click() {
        this.select.emit(null);
    }

    interact(item: any) {
        // Close sliding item
        this.add.emit(null);
        item.close();
    }
}
