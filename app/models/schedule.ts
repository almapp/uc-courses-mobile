import {Course, ScheduleSchema, ModuleSchema} from "./course";

export interface Block {
    day: string;
    block: number;
    modtype: string;
    NRC: string;
}

export const DAYS = ["D", "L", "M", "W", "J", "V", "S"];
export const MODULES = [1, 2, 3, 4, 5, 6, 7, 8];

export const EMPTY_WEEK = () => DAYS.map(_ => []);

export class Schedule {
    public _id: string;
    public _rev: string;
    public name: string;
    public position: number = 0;
    public NRCs: string[] = [];
    public courses = new Map();
    public week: Block[][][] = EMPTY_WEEK(); // Start with empty week

    constructor(courses: Course[] = []) {
        this.add(...courses);
    }

    get count(): number {
        return this.NRCs.length;
    }

    get iterableCourses(): Course[] {
        return Array.from(this.courses.values()) as Course[];
    }

    get credits(): number {
        return this.iterableCourses.map(c => c.credits).reduce((a, b) => a + b, 0);
    }

    get blocks(): Block[] {
        const result = [];
        this.week.forEach(day => day.forEach(blocks => result.push(...blocks)));
        return result;
    }

    course(NRC: string): Course {
        return this.courses.get(NRC) as Course;
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
        });
        this.day(day)[block] = blocks;
    }

    has(...courses: Course[]): boolean {
        return courses.every(course => this.courses.has(course.NRC));
    }

    fill(...courses: Course[]): this {
        courses.filter(course => !this.has(course)).forEach(course => {
            course.schedule.forEach(type => {
                type.modules.forEach(mod => {
                    mod.hours.forEach(hour => {
                        this.setBlock(mod.day, hour, type.identifier, course);
                    });
                });
            });
        });
        return this;
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
            this.courses.set(course.NRC, course);
            this.NRCs.push(course.NRC);
        });
        return this;
    }

    remove(...courses: Course[]): this {
        const NRCs = courses.map(course => course.NRC);
        this.week = this.week.map(day => {
            return day.map(block => {
                return block.filter(mod => NRCs.indexOf(mod.NRC) === -1);
            });
        });
        NRCs.forEach(NRC => this.courses.delete(NRC));
        this.NRCs = this.NRCs.filter(NRC => NRCs.indexOf(NRC) === -1);
        return this;
    }

    static compare(a: Schedule, b: Schedule): number {
        if (a.position < b.position) return -1;
        else if (a.position > b.position) return 1;
        else return 0;
    }
}
