import {Course, ScheduleSchema} from "./course";

export interface Block {
    day: string;
    block: number;
    modtype: string;
    NRC: number;
    course?: Course;
}

export interface Week {
    [Identifier: string]: Block[][];
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

    has(course: Course): boolean {
        return Object.keys(this.week).some(day => {
            return this.week[day].some(blocks => {
                return blocks.some(block => {
                    return block.NRC == course.NRC;
                });
            });
        });
    }

    add(course: Course) {
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
    }

    remove(course: Course) {
        return null;
    }

    process(courses: Course[]) {
        courses.forEach(this.add);
    }

    static parse(json: any): Schedule {
        const sch = new Schedule(json.name, json.position);
        sch.week = json.week;
        return sch;
    }
}
