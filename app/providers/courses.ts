import {Injectable} from "angular2/core";
import {Observable} from "rxjs/Observable";
import {Http, URLSearchParams} from "angular2/http";

import StorageProvider from "./storage";
import {Course} from "../models/course";

export interface Period {
    year: number | string;
    period: number | string;
}

export interface SearchQuery {
    section?: number | string;
    year?: number | string;
    period?: number | string;
    NRC?: number | string;
    name?: string;
    initials?: string;
    school?: string;
    campus?: string;
    places?: string[];
    teachers?: string[];
}

interface SectionParams {
    initials: string;
    year?: number;
    period?: number;
}

interface FetchParams {
    NRC?: string;
    section?: SectionParams;
}

export const ICONS = {
    "actuación": "bowtie",
    "agronomia e ing. forestal": "leaf",
    "arquitectura": "crop",
    "arte": "color-palette",
    "astrofisica": "planet",
    "cara": "body",
    "ciencia política": "bookmark",
    "ciencias biológicas": "bug",
    "ciencias de la salud": "medkit",
    "ciencias económicas y administrativas": "cash",
    "comunicaciones": "chatbubbles",
    "construcción civil": "hammer",
    "cursos deportivos": "football",
    "derecho": "briefcase",
    "diseño": "images",
    "educación": "star",
    "enfermería": "pulse",
    "estudios urbanos": "pin",
    "estética": "rose",
    "filosofía": "person",
    "física": "calculator",
    "geografía": "map",
    "historia": "clock",
    "ingeniería": "laptop",
    "letras": "book",
    "matemática": "cube",
    "medicina": "thermometer",
    "música": "musical-note",
    "odontología": "clipboard",
    "psicología": "help",
    "química": "beaker",
    "sociología": "people",
    "teología": "egg",
    "trabajo social": "happy",
    "villarrica": "image",
};

export const COLORS = {
    "CAT": "#fdb12e",
    "TALL": "#6755aa",
    "LAB": "#368cbf",
    "AYUD": "#37b66e",
    "PRAC": "#9ab837",
    "TERR": "#f389c9",
    "TES": "#a5b5d8",
    "OTRO": "#dc6067",
};


@Injectable()
export class CoursesProvider extends StorageProvider {
    public static LIMIT = 30;
    public url: string;

    constructor(private http: Http) {
        super();
    }

    schools(): Observable<string[]> {
        return new Observable(observer => {

            // Load from cache
            this.cache.get("schools")
                .then(results => results ? JSON.parse(results) : [])
                .then(schools => observer.next(schools.sort()));

            // Fetch from Web API
            this.request(`${this.url}/schools`)
                .then(schools => {
                    this.cache.setJson("schools", schools);
                    return schools;
                })
                .then(schools => observer.next(schools.sort()));
        });
    }

    campuses(): Observable<string[]> {
        return new Observable(observer => {

            // Load from cache
            this.cache.getJson("campuses")
                .then(results => results || [])
                .then(campuses => observer.next(campuses.sort()));

            // Fetch from Web API
            this.request(`${this.url}/campuses`)
                .then(campuses => { // Save to cache
                    this.cache.setJson("campuses", campuses);
                    return campuses;
                })
                .then(campuses => observer.next(campuses.sort()));
        });
    }

    courses(opts: { NRCs: string[], fetch?: boolean, persistent?: boolean }): Observable<Course[]> {
        return new Observable(observer => {

            // Load from storage
            this.load(opts).then(courses => {
                // Publish to subscribers
                observer.next(courses);

                if (opts.fetch) {
                    // Fetch from Web API
                    return Promise.all(opts.NRCs.map(NRC => this.fetch({ NRC: NRC }))).then(jsons => {
                        // Save to storage
                        return this.save({ data: jsons, persistent: opts.persistent});
                    }).then(courses => observer.next(courses));
                }
            });
        });
    }

    protected buildURL(opts: FetchParams = {}): string {
        if (opts.NRC) return `${this.url}/courses/NRC/${opts.NRC}`;
        if (opts.section) return `${this.url}/courses/${opts.section.initials}/${opts.section.year || "_"}/${opts.section.period || "_"}/sections`;
        return `${this.url}/courses`;
    }

    fetch(opts: FetchParams, params?: URLSearchParams): Promise<any | any[]> {
        const url = this.buildURL(opts);
        return this.request(url, params).then(json => {
            return (json instanceof Array) ? json.map(Course.prepare) : Course.prepare(json);
        });
    }

    load(opts: { NRCs: string[], persistent?: boolean }): Promise<Course[]> {
        if (opts.persistent) {
            return this.db.allDocs({ include_docs: true, keys: opts.NRCs })
                .then(result => result.total_rows ? result.rows.map(r => r.doc) : [])
                .then(docs => docs.map(Course.parse));
        } else {
            return Promise.all(opts.NRCs.map(NRC => this.cache.getJson(NRC)))
                .then(results => results ? results.map(Course.parse) : []);
        }
    }

    save(opts: { data: any | any[], persistent?: boolean }): Promise<Course[]> {
        const data = [].concat(opts.data);
        if (opts.persistent) {
            // Force update
            return this.db.bulkDocs(data, { "new_edits": false })
                .then(result => data.map(Course.parse));
        } else {
            return Promise.all(data.map(json => this.cache.setJson(json._id, json)))
                .then(result => data.map(Course.parse));
        }
    }

    sections(opts: SectionParams, params?: URLSearchParams): Promise<Course[]> {
        return this.fetch({ section: opts })
            .then(jsons => jsons.map(Course.parse));
    }

    fuzzy(name: string): Promise<Course[]> {
        return this.db.search({
            query: name,
            fields: ["name"],
            include_docs: true
            // build: true,
        })
        .then(res => res.total_rows ? res.rows.map(row => row.doc) : [])
        .then(docs => docs.map(Course.parse));
    }

    search(query: SearchQuery): Observable<Course[]> {
        return new Observable(observer => {
            this.fuzzy(query.name)
                .then(courses => courses.sort(Course.compare))
                .then(courses => observer.next(courses));

            const params = new URLSearchParams();
            Object.keys(query).forEach(key => {
                params.set(key, query[key]);
            });
            params.set("limit", String(CoursesProvider.LIMIT));
            this.fetch({}, params)
                .then(data => this.save({ data: data , persistent: true }))
                .then(courses => courses.sort(Course.compare))
                .then(courses => observer.next(courses))
                .then(() => observer.complete());
        });
    }

    request(url: string, params?: URLSearchParams): Promise<any> {
        if (!this.url) {
            throw new Error("No URL has been set");
        }
        return new Promise((resolve, reject) => {
            this.http.get(url, { search: params }).subscribe(
                res => resolve(res.json()),
                err => reject(err),
                () => console.log(`GET ${url} ${params || ""}`)
            );
        });
    }

    icon(school: string): string {
        return ICONS[school.trim().toLowerCase()];
    }

    color(modtype: string): string {
        return COLORS[modtype];
    }
}
