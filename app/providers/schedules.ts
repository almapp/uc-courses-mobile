import {Storage, SqlStorage} from "ionic-framework/ionic";
import {Injectable} from "angular2/core";
import {createHash} from "crypto";

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

export interface Schedules {
    [ Identifier: string ]: Schedule;
}

@Injectable()
export class SchedulesProvider {
    database: string;
    storage: Storage;

    schedules: Schedules;
    names: string[];

    constructor() {
        this.database = "buscacursos-uc";
        this.storage = new Storage(<any>SqlStorage, { name: this.database });
        this.schedules = {};
    }

    static nameToID(name: string): string {
        return createHash("md5").update(name).digest("hex");
    }

    save(schedule: Schedule): Promise<void> {
        return this.storage.set(SchedulesProvider.nameToID(schedule.name), JSON.stringify(schedule));
    }

    create(name: string, position?: number, courses?: Course[]): Promise<Schedule> {
        const schedule = new Schedule(name, position || 0, courses);
        return this.save(schedule).then(() => {
            // Save object
            return this.loadNames();
        }).then(names => {
            // Save name
            names.push(name);
            this.names = names;
            return this.storage.set("NAMES", JSON.stringify(names));
        }).then(() => {
            // Return on success
            return schedule;
        });
    }

    loadNames(): Promise<string[]> {
        return (this.names) ? Promise.resolve(this.names) : this.storage.get("NAMES").then(names => {
            this.names = (names && names.length) ? JSON.parse(names) : ["default"];
            return this.names;
        });
    }

    loadSchedule(name: string): Promise<Schedule> {
        const ID = SchedulesProvider.nameToID(name);
        return (this.schedules[ID]) ? Promise.resolve(this.schedules[ID]) : this.storage.get(ID).then(schedule => {
            if (schedule) {
                this.schedules[ID] = JSON.parse(schedule);
            } else if (name === "default") {
                this.schedules[ID] = new Schedule("Propio", 0);
            }
            return this.schedules[ID];
        });
    }

    loadAll(): Promise<Schedule[]> {
        return this.loadNames().then(names => {
            return Promise.all(names.map(name => this.loadSchedule(name)));
        });
    }
}
