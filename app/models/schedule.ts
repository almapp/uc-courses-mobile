import {Course, ScheduleSchema} from "./course";

export interface Block {
    day: string;
    block: number;
    modtype: string;
    NRC: number;
}

export interface Week {
    [ Identifier: string ]: Block[];
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

    process(courses: Course[]) {
        courses.forEach(course => {
            Object.keys(course.schedule).forEach(modType => {
                const mod: ScheduleSchema = course.schedule[modType];
                Object.keys(mod.modules).forEach(day => {
                    this.week[day].push(...mod.modules[day].map(n => {
                        return {
                            day: day,
                            block: n,
                            modtype: modType,
                            NRC: course.NRC,
                        } as Block;
                    }));
                });
            });
        });
    }
}
