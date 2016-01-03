import {Storage, SqlStorage} from "ionic-framework/ionic";
import {Injectable} from "angular2/core";
import {createHash} from "crypto";

import {Course, ScheduleSchema} from "../models/course";
import {Schedule} from "../models/schedule";

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
