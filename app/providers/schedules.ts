import {Storage, SqlStorage} from "ionic-angular";
import {Injectable} from "angular2/core";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/share";
import "rxjs/add/operator/first";
import "rxjs/add/operator/publishReplay";
import "rxjs/add/operator/concat";
import "rxjs/add/observable/fromPromise";

import StorageProvider from "./storage";
import {CoursesProvider} from "./courses";

import {Course} from "../models/course";
import {Schedule, EMPTY_WEEK} from "../models/schedule";


export interface ScheduleSchema {
    _id?: string;
    _rev?: string;
    name: string;
    position: number;
    NRCs: string[];
}

@Injectable()
export class SchedulesProvider extends StorageProvider {
    public data = new Map();
    public schedules: Observable<Schedule[]>;
    private observer: any;

    constructor(private provider: CoursesProvider) {
        super();
        this.schedules = new Observable(observer => this.observer = observer).share();
    }

    get all(): Schedule[] {
        const array = Array.from(this.data.values()) as Schedule[];
        return array.sort(Schedule.compare);
    }

    setup(name = "database") {
        const db = super.setup(name);
        this.loadAll({ fetch: true, persistent: true }).first().subscribe(result => {
            if (result.length === 0) {
                this.create("Propio", 0).then(sch => {
                    console.log("Created", sch._id);
                }).catch(console.error);
            }
        });
        return db;
    }

    source(): Observable<Schedule[]> {
        // return this.schedules;
        return Observable.fromPromise(Promise.resolve(this.all)).concat(this.schedules);
    }

    delete(schedule: Schedule): Promise<void> {
        return this.db.remove(schedule._id, schedule._rev).then(success => {
            this.data.delete(schedule._id);
            this.observer.next(this.all);
            return success;
        });
    }

    save(schedule: Schedule): Promise<Schedule> {
        const doc: ScheduleSchema = {
            _id: schedule._id,   // undefined if new
            _rev: schedule._rev, // undefined if new
            name: schedule.name,
            position: schedule.position,
            NRCs: schedule.NRCs,
        };

        const operation = (doc._id && this.data.has(doc._id)) ? this.db.put(doc) : this.db.post(doc);

        return operation.then(success => {
            schedule._id = success.id;
            schedule._rev = success.rev;
            this.data.set(schedule._id, schedule);
            this.observer.next(this.all);
            return schedule;
        });
    }

    create(name: string, position?: number, courses: Course[] = []): Promise<Schedule> {
        const schedule = new Schedule(courses);
        schedule.name = name;
        schedule.position = position;
        return this.save(schedule);
    }

    clone(schedule: Schedule, name?: string): Schedule {
        const clone = new Schedule(schedule.iterableCourses);
        clone.name = name || schedule.name;
        clone.position = schedule.position + 1;
        return clone;
    }

    protected load(primitive: ScheduleSchema, opts: { fetch?: boolean, persistent?: boolean }) {
        this.provider.courses({ NRCs: primitive.NRCs, fetch: opts.fetch, persistent: opts.persistent}).subscribe(courses => {
            const schedule = new Schedule(courses || []);
            schedule._id = primitive._id;
            schedule._rev = primitive._rev;
            schedule.name = primitive.name;
            schedule.position = primitive.position;
            this.data.set(schedule._id, schedule);
            this.observer.next(this.all);
        });
    }

    protected loadAll(opts: { fetch?: boolean, persistent?: boolean } = {}): Observable<Schedule[]> {
        this.db.allDocs({ include_docs: true }).then(result => {
            return result.total_rows ? result.rows.map(r => r.doc) : [];
        })
        .then(jsons => {
            if (jsons.length === 0) this.observer.next([]);
            else jsons.forEach(json => this.load(json, opts));
        });

        return this.schedules;
    }
}
