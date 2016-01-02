import {Injectable} from "angular2/core";
import {Http} from "angular2/http";

import {Course} from "../models/course";

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
    campus?: string;
    places?: [string];
}

@Injectable()
export class CoursesProvider {
    private url = "http://localhost:3000/api/v1";

    constructor(private http: Http) {
        // ...
    }

    search(period: Period, initials: string): Promise<[Course]> {
        return new Promise(resolve => {
            this.http.get(`${this.url}/courses/${period.year}/${period.period}/search?initials=${initials}`).subscribe(res => {
                const courses: [Course] = res.json();
                resolve(courses);
            });
        });
    }
}
