import {Component, Input} from "angular2/core";
import {Icon, Item} from "ionic-framework/ionic";

import {Course, DAYS} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {SchedulesProvider, Schedule} from "../../providers/schedules";

interface Hour {
    start: string;
    end: string;
}

interface CourseModule {
    course: Course;
    campus: string;
    modtype: string;
    classroom: string;
}

@Component({
    selector: "schedule-block",
    templateUrl: "build/components/schedule-block/schedule-block.html",
    directives: [Icon, Item],
    providers: [CoursesProvider, SchedulesProvider],
})
export class ScheduleBlock {
    @Input() day: string;
    @Input() block: string;
    @Input() courses: Course[];

    private courseModules: CourseModule[];
    private hour: Hour;

    constructor(private provider: CoursesProvider, private manager: SchedulesProvider) {
        // ...
    }

    ngOnInit() {
        this.hour = {
            start: "",
            end: ""
        };
        this.courseModules = []; // this.courses.map(course => {});
    }

    moduleTypeFor(course: Course): string {
        return "";
    }
}
