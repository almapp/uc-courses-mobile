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
    private url = "http://localhost:3000/api/v1";
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

    fullSearch(period: Period, query: FullSearchQuery): Promise<Course[]> {
        const url = `${this.url}/courses/${period.year}/${period.period}/fullsearch`;
        const params = new URLSearchParams();
        if (query.q) { params.set("q", query.q); }
        if (query.campus) { params.set("campus", query.campus.name); }
        return this.request(url, params);
    }

    search(period: Period, query: SearchQuery): Promise<Course[]> {
        const url = `${this.url}/courses/${period.year}/${period.period}/search`;
        const params = new URLSearchParams();
        if (query.initials) { params.set("initials", query.initials); }
        if (query.campus) { params.set("campus", query.campus.name); }
        return this.request(url, params);
    }

    request(url: string, params?: URLSearchParams): Promise<Course[] | Course> {
        return new Promise(resolve => {
            // TODO: Error catch
            this.http.get(url, {
                search: params
            }).subscribe(res => {
                resolve(res.json());
            });
        }).then(json => {
            return (json instanceof Array) ? json.map(Course.parse) : Course.parse(json);
        });
    }

    requestByNRC(NRC: number): Promise<Course> {
        // TODO: Period?
        const url = `${this.url}/courses/_/_/NRC/${NRC}`;
        return this.request(url);
    }
}
