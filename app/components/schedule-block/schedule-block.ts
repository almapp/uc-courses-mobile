import {Component, Input, Pipe, OnInit} from "angular2/core";
import {Icon, Item} from "ionic-framework/ionic";

import {Block} from "../../models/schedule";
import {Course} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";

interface Hour {
    start: string;
    end: string;
}

@Pipe({
    name: "fetch",
})
export class FetchPipe {
    constructor(private provider: CoursesProvider) {
        // ...
    }

    transform(blocks: Block[], args: string[]): Promise<Block[]> {
        return Promise.all(blocks.map(block => {
            return this.provider.getByNRC(block.NRC).then(course => {
                block.course = course;
                return block;
            });
        }));
    }
}

@Component({
    selector: "schedule-block",
    templateUrl: "build/components/schedule-block/schedule-block.html",
    directives: [Icon, Item],
    pipes: [FetchPipe],
})
export class ScheduleBlock implements OnInit{
    @Input() blocks: Block[];

    private block: number;
    private day: string;
    private hour: Hour;

    static HOURS: Hour[] = [
        { start: "INVALID", end: "INVALID" },
        { start: "8:30", end: "9:50" },
        { start: "10:00", end: "11:20" },
        { start: "11:30", end: "12:50" },
        { start: "14:00", end: "15:20" },
        { start: "15:30", end: "16:50" },
        { start: "17:00", end: "18:20" },
        { start: "18:30", end: "19:50" },
        { start: "20:00", end: "21:20" },
    ];

    constructor(private provider: CoursesProvider) {
        // ...
    }

    ngOnInit() {
        this.block = this.blocks[0].block;
        this.day = this.blocks[0].day;
        this.hour = ScheduleBlock.HOURS[this.block];
    }

    icon(course: Course): string {
        return Course.icon(course.school);
    }
}
