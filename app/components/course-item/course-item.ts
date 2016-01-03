import {Component, Input, Output, EventEmitter} from "angular2/core";
import {Item, ItemSliding} from "ionic-framework/ionic";

import {Course, Block, DAYS, MODULES} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";

interface Module {
    type: string;
    blocks: Block[];
    classroom: string;
}

@Component({
    selector: "course-item",
    templateUrl: "build/components/course-item/course-item.html",
    directives: [Item, ItemSliding],
    providers: [CoursesProvider],
})
export class CourseItem {
    @Input() course: Course;
    @Output() select = new EventEmitter();

    modules: Module[];

    constructor(private provider: CoursesProvider) {
        // ...
    }

    ngOnInit() {
        this.modules = this.course.schedule ? this.course.activeModules.map(type => {
            return {
                type: type,
                blocks: this.course.blocks(type),
                classroom: this.course.place(type),
            };
        }) : [];
    }

    click() {
        this.select.emit(null);
    }

    add() {
        console.log("add() on", this.course.initials);
    }
}
