import {Storage, SqlStorage} from "ionic-framework/ionic";
import {Injectable} from "angular2/core";

import {Course, ScheduleSchema} from "../models/course";

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

@Injectable()
export class SchedulesProvider {
    database: string;
    storage: Storage;
    schedules: Schedule[];

    constructor() {
        this.database = "buscacursos-uc";
        this.storage = new Storage(<any>SqlStorage, { name: this.database });

        // Default schedule
        // this.storage.get("schedules").then(result => {
        //     this.schedules = (result) ? JSON.parse(result) : [new Schedule("Propio", 0)];
        // });

        // Ensure schedule list;
        // this.storage.get("SCHEDULES").then(result => {
        //     if (!result) {
        //         this.storage.set("SCHEDULES", JSON.stringify(["Personal"]));
        //     }
        // });
    }

    load(force=false): Promise<Schedule[]> {
        if (force || !this.schedules) {
            return this.storage.get("schedules").then(result => {
                this.schedules = (result) ? JSON.parse(result) : [new Schedule("Propio", 0)];
                return this.schedules;
            });
        } else {
            return Promise.resolve(this.schedules);
        }
    }
}
