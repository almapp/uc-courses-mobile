import {Storage, SqlStorage} from "ionic-framework/ionic";
import {Injectable} from "angular2/core";
import {createHash} from "crypto";

import {Course, ScheduleSchema} from "../models/course";
import {Schedule} from "../models/schedule";

export interface Schedules {
    [ Identifier: string ]: Schedule;
}

const DEBUG = true;

function debug(text: string, obj?: any) {
    if (DEBUG) {
        console.log(text, JSON.stringify(obj));
    }
}

@Injectable()
export class SchedulesProvider {
    database: string;
    storage: Storage;

    schedules: Schedules;
    IDS: string[];

    constructor() {
        this.database = "buscacursos-uc";
        this.storage = new Storage(<any>SqlStorage, { name: this.database });
        this.schedules = {};
    }

    static nameToID(name: string): string {
        return createHash("md5").update(name).digest("hex");
    }

    loadIDS(): Promise<string[]> {
        return (this.IDS && this.IDS.length !== 0) ? Promise.resolve(this.IDS) : this.storage.get("NAMES").then(JSON.parse).then(IDS => {
            debug("Loaded IDS:", IDS);
            return this.IDS = IDS || [];
        });
    }

    saveIDS(IDS: string[]): Promise<void> {
        this.IDS = IDS;
        debug("Saving IDS:", IDS);
        return this.storage.set("NAMES", JSON.stringify(IDS));
    }

    delete(schedule: Schedule): Promise<void> {
        const ID = SchedulesProvider.nameToID(schedule.name);
        return this.storage.remove(ID)
            .then(() => {
                debug("Deleted schedule:", schedule);
                return this.loadIDS();
            })
            .then(IDS => {
                return this.saveIDS(IDS.filter(i => i !== ID));
            });
    }

    save(schedule: Schedule): Promise<void> {
        debug("Saving:", schedule);
        return this.storage.set(SchedulesProvider.nameToID(schedule.name), JSON.stringify(schedule));
    }

    create(name: string, position?: number, courses?: Course[]): Promise<Schedule> {
        const schedule = new Schedule(name, position || 0, courses);
        return this.save(schedule).then(() => {
            // Save object
            debug("Created:", schedule);
            return this.loadIDS();
        }).then(names => {
            // Save name
            names.push(SchedulesProvider.nameToID(name));
            return this.saveIDS(names);
        }).then(() => {
            // Return on success
            return schedule;
        });
    }

    loadSchedule(ID: string): Promise<Schedule> {
        return (this.schedules[ID]) ? Promise.resolve(this.schedules[ID]) : this.storage.get(ID).then(schedule => {
            if (schedule) {
                debug("Loaded Schedule:", schedule);
                return this.schedules[ID] = Schedule.parse(JSON.parse(schedule));
            } else {
                debug("Schedule Not Found:", ID);
                return null;
            }
        });
    }

    loadAll(): Promise<Schedule[]> {
        return this.loadIDS().then(IDS => {
            return Promise.all(IDS.map(ID => this.loadSchedule(ID)));
        });
    }
}
