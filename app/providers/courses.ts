import {Injectable} from "angular2/core";
import {Http, URLSearchParams} from "angular2/http";

import {Course, MODULES, DAYS} from "../models/course";

export interface Period {
    year: number | string;
    period: number | string;
}

export interface Campus {
    name: string;
    identifier: string;
}

export interface FullSearchQuery {
    q: string;
    campus?: Campus;
}

export interface SearchQuery {
    name?: string;
    initials?: string;
    section?: string;
    NRC?: string;
    school?: string;
    teacher?: string;
    campus?: Campus;
    places?: string[];
}

interface Cache {
    [ Identifier: number ]: Course;
}

@Injectable()
export class CoursesProvider {
    public url: string;
    private cache: Cache;

    constructor(private http: Http) {
        this.cache = {};
    }

    getByNRC(NRC: number): Promise<Course> {
        return (this.cache[NRC]) ? Promise.resolve(this.cache[NRC]) : this.requestByNRC(NRC).then(course => {
            this.cache[NRC] = course;
            return course;
        });
    }

    sections(opts: { course?: Course, initials?: string, period?: Period }): Promise<Course[]> {
        const period = opts.period || { year: opts.course.year, period: opts.course.period };
        const initials = opts.course.initials || opts.initials;
        const url = `${this.url}/courses/${initials}/${period.year}/${period.period}/sections`;
        return this.request(url);
    }

    fullSearch(period: Period, query: FullSearchQuery): Promise<Course[]> {
        const url = `${this.url}/courses`;
        const params = new URLSearchParams();
        params.set("year", String(period.year));
        params.set("period", String(period.period));
        if (query.q) { params.set("q", query.q); }
        if (query.campus) { params.set("campus", query.campus.name); }
        return this.request(url, params);
    }

    search(period: Period, query: SearchQuery): Promise<Course[]> {
        const url = `${this.url}/courses`;
        const params = new URLSearchParams();
        params.set("year", String(period.year));
        params.set("period", String(period.period));
        if (query.initials) { params.set("initials", query.initials); }
        if (query.campus) { params.set("campus", query.campus.name); }
        return this.request(url, params);
    }

    request(url: string, params?: URLSearchParams): Promise<Course[] | Course> {
        if (!this.url) {
            throw new Error("No URL has been set");
        }

        return new Promise((resolve, reject) => {
            this.http.get(url, {
                search: params
            }).subscribe(res => resolve(res.json()), err => reject(err), () => console.log(`GET ${url} ${params || ""}`));
        }).then(json => {
            return (json instanceof Array) ? json.map(Course.parse) : Course.parse(json);
        });
    }

    requestByNRC(NRC: number): Promise<Course> {
        const url = `${this.url}/courses/NRC/${NRC}`;
        return this.request(url);
    }
}
