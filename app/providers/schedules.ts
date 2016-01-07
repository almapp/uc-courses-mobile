import {Storage, SqlStorage} from "ionic-framework/ionic";
import {Injectable, EventEmitter} from "angular2/core";
import {createHash} from "crypto";

import {Course, ScheduleSchema} from "../models/course";
import {Schedule} from "../models/schedule";

import {CoursesProvider} from "./courses";

export interface Schedules {
    [ Identifier: string ]: Schedule;
}

const DEBUG = true;

function debug(text: string, obj?: any) {
    if (DEBUG) {
        console.log(text, JSON.stringify(obj));
    }
}

function nameToID(name: string): string {
    return createHash("md5").update(name).digest("hex");
}

@Injectable()
export class SchedulesProvider {
    // Database
    private database: string;
    private storage: Storage;

    // Cache
    private schedules: Schedules;
    private IDS: string[];

    // Events
    public updated: EventEmitter<Schedule> = new EventEmitter<Schedule>();
    public new: EventEmitter<Schedule> = new EventEmitter<Schedule>();
    public removed: EventEmitter<Schedule> = new EventEmitter<Schedule>();

    constructor() {
        this.database = "buscacursos-uc";
        this.storage = new Storage(<any>SqlStorage, { name: this.database });
        this.schedules = {};
    }

    loadIDS(): Promise<string[]> {
        return (this.IDS && this.IDS.length !== 0) ? Promise.resolve(this.IDS) : this.storage.get("NAMES")
            .then(JSON.parse)
            .then(IDS => IDS || [])
            .then(IDS => this.IDS = IDS);
    }

    saveIDS(IDS: string[]): Promise<void> {
        this.IDS = IDS;
        return this.storage.set("NAMES", JSON.stringify(IDS));
    }

    delete(schedule: Schedule): Promise<void> {
        const ID = nameToID(schedule.name);
        return this.storage.remove(ID)
            .then(() => this.loadIDS())
            .then(IDS => this.saveIDS(IDS.filter(i => i !== ID)))
            .then(() => this.removed.emit(schedule));
    }

    save(schedule: Schedule): Promise<void> {
        const ID = nameToID(schedule.name);
        this.schedules[ID] = schedule;
        return this.storage.set(ID, JSON.stringify(schedule.prepareSave()))
            .then(() => this.updated.emit(schedule));
    }

    create(name: string, position?: number, courses?: Course[]): Promise<Schedule> {
        const schedule = new Schedule(name, position || 0, courses);
        return this.save(schedule)
            .then(() => this.loadIDS())
            .then(IDS => {
                // Save name
                IDS.push(nameToID(name));
                return this.saveIDS(IDS);
            }).then(() => {
                // Return on success
                this.new.emit(schedule);
                return schedule;
            });
    }

    load(ID: string): Promise<Schedule> {
        return (this.schedules[ID]) ? Promise.resolve(this.schedules[ID]) : this.storage.get(ID).then(schedule => {
            return (schedule) ? this.schedules[ID] = Schedule.parse(JSON.parse(schedule)) : null;
        });
    }

    loadAll(): Promise<Schedule[]> {
        return this.loadIDS().then(IDS => {
            return Promise.all(IDS.map(ID => this.load(ID)));
        });
    }
}
