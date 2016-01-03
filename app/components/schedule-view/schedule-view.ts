import {Component, Input} from "angular2/core";
import {Segment, SegmentButton, Item} from "ionic-framework/ionic";

import {Course, DAYS} from "../../models/course";
import {Schedule, Block} from "../../models/schedule";
import {CoursesProvider} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {ScheduleBlock} from "../schedule-block/schedule-block";

const WEEKDAYS = [
    "D",
    "L",
    "M",
    "W",
    "J",
    "V",
    "S",
];

interface CourseBlock extends Block {
    course: Course;
}

interface CoursesPerBlock {
    [ Identifier: number ]: CourseBlock[];
}

@Component({
    selector: "schedule-view",
    templateUrl: "build/components/schedule-view/schedule-view.html",
    directives: [ScheduleBlock, Segment, SegmentButton, Item],
    providers: [CoursesProvider, SchedulesProvider],
})
export class ScheduleView {
    @Input() schedule: Schedule;

    current: string;
    days: string[] = DAYS;

    cblocks: CourseBlock[] = [];

    coursesPerBlock: CoursesPerBlock = {};
    todayBlocks: number[] = [];

    constructor(private provider: CoursesProvider, private manager: SchedulesProvider) {
        this.current = this.today;
    }

    coursesForDay(day: string): Promise<CourseBlock[]> {
        const blocks = this.schedule.week[day];
        return Promise.all(blocks.map(block => {
            return this.provider.getByNRC(block.NRC).then(course => {
                block["course"] = course;
                return block as CourseBlock;
            });
        }));
    }

    coursesForBlock(cblocks, day): CoursesPerBlock {
        return cblocks.filter(cb => cb.day === day).sort((a, b) => a.block - b.block).reduce((cblks, cb) => {
            if (cblks[cb.block]) {
                cblks[cb.block].push(cb);
            } else {
                cblks[cb.block] = [cb];
            }
            return cblks;
        }, {} as CoursesPerBlock);
    }

    get today(): string {
        return WEEKDAYS[new Date().getDay()];
    }

    selectDay(day: string) {
        console.log(day, JSON.stringify(this.schedule));
        this.current = day;
        this.coursesForDay(day).then(cblocks => {
            this.cblocks = cblocks;
            this.coursesPerBlock = this.coursesForBlock(cblocks, day);
            this.todayBlocks = Object.keys(this.coursesPerBlock).map(Number);
        });
    }
}
