import {Component, Input} from "angular2/core";
import {Item, ItemSliding} from "ionic-framework/ionic";

import {Course} from "../../models/course";
import {CoursesProvider, Period, Campus, DAYS, MODULES} from "../../providers/courses";

interface Module {
    type: string;
    blocks: {
        day: string;
        hours: number[];
    }[];
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

    modules: Module[];

    constructor(private provider: CoursesProvider) {
        // ...
    }

    ngOnInit() {
        this.modules = this.course.schedule ? MODULES.filter(type => this.course.schedule[type]).map(type => {
            return {
                type: type,
                blocks: this.day(type),
                classroom: this.place(type),
            };
        }) : [];
    }

    select() {
        console.log("select() on", this.course.initials);
    }

    add() {
        console.log("add() on", this.course.initials);
    }

    get teachersName(): string {
        return this.course.teachers.map(t => t.name).join(", ");
    }

    private place(type: string): string {
        const mod = this.course.schedule[type];
        const place = mod ? mod.location.place : null;
        return place ? place : "?";
    }

    private day(type: string) {
        const blocks = [];
        for (let day of DAYS) {
            const array = this.course.schedule[type].modules[day];
            if (array && array.length !== 0) {
                blocks.push({ day: day, hours: array });
            }
        }
        return blocks;
    }
}
