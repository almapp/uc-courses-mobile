import {Component, Input, Output, EventEmitter, OnInit} from "angular2/core";
import {Item, ItemSliding} from "ionic-framework/ionic";

import {Course, Block} from "../../models/course";

interface Module {
    type: string;
    blocks: Block[];
    classroom: string;
}

@Component({
    selector: "course-item",
    templateUrl: "build/components/course-item/course-item.html",
    directives: [Item, ItemSliding],
})
export class CourseItem implements OnInit {
    @Input() course: Course;
    @Output() select = new EventEmitter();
    @Output() add = new EventEmitter();

    modules: Module[];

    ngOnInit() {
        this.modules = this.course.schedule ? this.course.activeModules.map(type => {
            return {
                type: type,
                blocks: this.course.blocks(type),
                classroom: this.course.place(type),
            };
        }) : null;
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
