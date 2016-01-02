import {Injectable} from "angular2/core";
import {Http, URLSearchParams} from "angular2/http";

import {Course} from "../models/course";

export const MODULES = [
    "CAT",
    "TALL",
    "LAB",
    "AYUD",
    "PRAC",
    "TERR",
    "TES",
    "OTRO",
];

export const DAYS = [
    "L",
    "M",
    "W",
    "J",
    "V",
    "S",
    "D",
];

export interface Period {
    year: number;
    period: number;
}

export interface Campus {
    name: string;
    identifier: string;
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

@Injectable()
export class CoursesProvider {
    private url = "http://localhost:3000/api/v1";

    constructor(private http: Http) {
        // ...
    }

    search(period: Period, query: SearchQuery): Promise<Course[]> {
        return new Promise(resolve => {
            const params = new URLSearchParams();
            if (query.campus) { params.set("campus", query.campus.name); }
            if (query.initials) { params.set("initials", query.initials); }

            this.http.get(`${this.url}/courses/${period.year}/${period.period}/search`, {
                search: params
            }).subscribe(res => {
                resolve(res.json());
            });
        });
    }
}
