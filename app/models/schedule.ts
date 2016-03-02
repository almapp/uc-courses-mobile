import {Course, ScheduleSchema, ModuleSchema} from "./course";

export interface Block {
    day: string;
    block: number;
    modtype: string;
    NRC: number;
    // course: Course;
}

export const DAYS = ["D", "L", "M", "W", "J", "V", "S"];
export const MODULES = [1, 2, 3, 4, 5, 6, 7, 8];

export class Schedule {
    public courses: Course[] = [];
    public week: Block[][][] = DAYS.map(_ => []); // Start with empty week

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
        this.week.forEach(day => day.forEach(blocks => result.push(...blocks)));
        return result;
    }

    course(NRC: number): Course {
        return this.courses.find(course => course.NRC === NRC);
    }

    day(day: string): Block[][] {
        return this.week[DAYS.indexOf(day)];
    }

    block(day: string, block: number): Block[] {
        return this.day(day)[block];
    }

    setBlock(day: string, block: number, type: string, course: Course) {
        const blocks = this.block(day, block) || [];
        blocks.push({
            day: day,
            block: block,
            modtype: type,
            NRC: course.NRC,
            // course: course,
        });
        this.day(day)[block] = blocks;
    }

    has(course: Course): boolean {
        return this.courses.map(c => c.NRC).indexOf(course.NRC) > -1;
    }

    add(...courses: Course[]): this {
        courses.filter(course => !this.has(course)).forEach(course => {
            course.schedule.forEach(type => {
                type.modules.forEach(mod => {
                    mod.hours.forEach(hour => {
                        this.setBlock(mod.day, hour, type.identifier, course);
                    });
                });
            });
            this.courses.push(course);
        });
        return this;
    }

    remove(...courses: Course[]): this {
        // TODO: improve performance
        const NRCs = courses.map(course => course.NRC);
        this.courses = this.courses.filter(c => NRCs.indexOf(c.NRC) === -1);
        this.week = DAYS.map(_ => []);
        this.add(...this.courses);
        return this;
    }

    process(courses: Course[]) {
        this.add(...courses);
    }

    prepareSave(): JSON {
        return Schedule.toJSON(this) as any;
    }

    static toJSON(scheudle: Schedule): JSON {
        return JSON.parse(JSON.stringify(scheudle));
    }

    static parse(json: any): Schedule {
        const courses = json.courses.map(Course.parse);
        return new Schedule(json.name, json.position, courses);
    }
}
