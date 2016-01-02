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

    static MODULES = [
        "CAT",
        "TALL",
        "LAB",
        "AYUD",
        "PRAC",
        "TERR",
        "TES",
        "OTRO",
    ];

    static DAYS = [
        "L",
        "M",
        "W",
        "J",
        "V",
        "S",
        "D",
    ];

    constructor() {
        // ...
    }

    place(modtype: string): string {
        const mod = this.course.schedule[modtype];
        const place = mod ? mod.location.place : null;
        return place ? place : "?";
    }

    teachersName(): string {
        return this.course.teachers.map(t => t.name).join(", ");
    }

    activeModules(): string[] {
        return CourseItem.MODULES.filter(mod => this.course.schedule[mod]);
    }

    activeDays(modtype: string): string[] {
        return CourseItem.DAYS.filter(day => {
            const array = this.course.schedule[modtype].modules[day];
            return array && array.length !== 0;
        }).map(day => {
            return {
                day: day,
                modules: this.course.schedule[modtype].modules[day].join(","),
            };
        });
    }
}
