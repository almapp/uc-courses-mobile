import {Course, ScheduleSchema} from "./course";

export interface Block {
    day: string;
    block: number;
    modtype: string;
    NRC: number;
    course: Course;
}

export interface Week {
    [Identifier: string]: Block[][];
}

export class Schedule {
    courses: Course[] = [];
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
        } else {
            this.courses = [];
        }
    }

    get count(): number {
        return this.courses.length;
    }

    get credits(): number {
        return this.courses.map(c => c.credits).reduce((a, b) => a + b, 0);
    }

    get NRCs(): number[] {
        return this.courses.map(c => c.NRC);
    }

    get blocks(): Block[] {
        const result = [];
        Object.keys(this.week).forEach(day => {
            this.week[day].filter(Boolean).forEach(blocks => {
                result.push(...blocks.filter(Boolean));
            });
        });
        return result;
    }

    cellAt(day: string, block: number): Block[] {
        const array = this.week[day];
        if (!array[block]) {
            return array[block] = [];
        }
        return array[block];
    };

    has(course: Course): boolean {
        return this.courses.indexOf(course) > -1;
    }

    add(course: Course): this {
        if (this.has(course)) {
            return this;
        }
        Object.keys(course.schedule).forEach(modType => {
            const mod: ScheduleSchema = course.schedule[modType];
            Object.keys(mod.modules).forEach(day => {
                mod.modules[day].forEach(n => {
                    this.cellAt(day, n).push({
                        day: day,
                        block: n,
                        modtype: modType,
                        NRC: course.NRC,
                        course: course,
                    });
                });
            });
        });
        this.courses.push(course);
        return this;
    }

    remove(course: Course): this {
        if (!this.has(course)) {
            return this;
        }
        Object.keys(this.week).forEach(day => {
            this.week[day] = this.week[day].filter(Boolean).map(blocks => {
                return blocks.filter(Boolean).filter(block => {
                    return block.NRC !== course.NRC;
                });
            });
        });
        this.courses = this.courses.filter(c => c.NRC !== c.NRC);
        return this;
    }

    process(courses: Course[]) {
        courses.forEach(c => this.add(c));
    }

    static toJSON(scheudle: Schedule): JSON {
        return JSON.parse(JSON.stringify(scheudle));
    }

    prepareSave(): JSON {
        // Clone
        const json = Schedule.toJSON(this) as any;
        // Replace week by a clone without courses
        json.week = {};
        Object.keys(this.week).forEach(day => {
            json.week[day] = this.week[day].map(blocks => {
                if (!blocks) {
                    return null;
                }
                return blocks.map(block => {
                    return {
                        day: block.day,
                        block: block.block,
                        modtype: block.modtype,
                        NRC: block.NRC,
                    };
                });
            });
        });
        return json;
    }

    static parse(json: any): Schedule {
        const courses = json.courses.map(Course.parse);
        return new Schedule(json.name, json.position, courses);
    }
}
