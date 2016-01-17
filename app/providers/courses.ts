import {Injectable} from "angular2/core";
import {Http, URLSearchParams} from "angular2/http";

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
    "construcción civil": "settings",
    "cursos deportivos": "football",
    "derecho": "brief",
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
    "villarica": "image",
};

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

    schools(): Promise<string[]> {
        return this.request(`${this.url}/schools`);
    }

    campuses(): Promise<string[]> {
        return this.request(`${this.url}/campuses`);
    }

    sections(opts: { course?: Course, initials?: string, period?: Period }): Promise<Course[]> {
        const period = opts.period || { year: opts.course.year, period: opts.course.period };
        const initials = opts.course.initials || opts.initials;
        const url = `${this.url}/courses/${initials}/${period.year}/${period.period}/sections`;
        return this.courses(url);
    }

    search(query: SearchQuery): Promise<Course[]> {
        const url = `${this.url}/courses`;
        const params = new URLSearchParams();
        Object.keys(query).forEach(key => {
            params.set(key, query[key]);
        });
        return this.courses(url, params);
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

    courses(url: string, params?: URLSearchParams): Promise<Course | Course[]> {
        return this.request(url, params).then(json => {
            return (json instanceof Array) ? json.map(Course.parse) : Course.parse(json);
        });
    }

    requestByNRC(NRC: number): Promise<Course> {
        return this.courses(`${this.url}/courses/NRC/${NRC}`);
    }

    icon(school: string): string {
        return ICONS[school.trim().toLowerCase()];
    }
}
