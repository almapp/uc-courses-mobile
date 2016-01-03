import {Course, ScheduleSchema} from "./course";

export interface Block {
    day: string;
    block: number;
    modtype: string;
    NRC: number;
    course?: Course;
}

export interface Week {
    [ Identifier: string ]: Block[][];
}

export class Schedule {
    week: Week = {
        "L": [],
        "M": [],
        "W": [],
        "J": [],
        "V": [],
        "S": [],
        "D": [],
    };

    constructor(public name: string, public position = 0, courses?: Course[]) {
        if (courses) {
            this.process(courses);
        }
    }

    cellAt(day: string, block: number): Block[] {
        const array = this.week[day];
        if (!array[block]) {
            return array[block] = [];
        }
        return array[block];
    };

    process(courses: Course[]) {
        courses.forEach(course => {
            Object.keys(course.schedule).forEach(modType => {
                const mod: ScheduleSchema = course.schedule[modType];
                Object.keys(mod.modules).forEach(day => {
                    mod.modules[day].forEach(n => {
                        this.cellAt(day, n).push({
                            day: day,
                            block: n,
                            modtype: modType,
                            NRC: course.NRC,
                        });
                    });
                });
            });
        });
    }
}
