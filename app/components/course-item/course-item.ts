import {Component, Input} from "angular2/core";
import {Item} from "ionic-framework/ionic";

import {Course} from "../../models/course";

@Component({
    selector: "course-item",
    templateUrl: "build/components/course-item/course-item.html",
    directives: [Item]
})
export class CourseItem {
    @Input() course: Course;
    constructor() {
        // ...
    }

    teachersName(): String {
        return this.course.teachers.map(t => t.name).join(", ");
    }
}
