import {Page, NavController, NavParams, Modal, Alert, ViewController, Keyboard} from "ionic-angular";
import {Pipe} from "angular2/core";
import {FORM_DIRECTIVES} from "angular2/common";

import {Course} from "../../models/course";
import {CoursesProvider, SearchQuery, Period} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {CourseItem} from "../../components/course-item/course-item";

import {SectionPage} from "../section/section";
import {AddRemovePage} from "../add-remove/add-remove";

@Pipe({
    name: "periodize"
})
export class HumanizePeriodPipe {
    public static TABLE = {
        "1": "1",
        "2": "2",
        "3": "TAV",
    };

    static transform(period: Period): string {
        return `${period.year}-${HumanizePeriodPipe.TABLE[period.period]}`;
    }

    transform(period: Period, args: string[]): string {
        return HumanizePeriodPipe.transform(period);
    }
}

@Page({
    templateUrl: "build/pages/courses/courses.html",
    pipes: [HumanizePeriodPipe],
    directives: [FORM_DIRECTIVES, CourseItem],
})
export class CoursesPage {
    private period: Period;
    private periods: Period[] = [];
    private campuses: string[] = [];
    private schools: string[] = [];

    private courses: Course[][];

    private query = {
        campus: "",
        school: "",
    };
    private operation: boolean;

    constructor(
        private nav: NavController,
        private provider: CoursesProvider,
        private manager: SchedulesProvider,
        private keyboard: Keyboard) {

        this.provider.campuses().subscribe(campuses => this.campuses = campuses);
        this.provider.schools().subscribe(schools => this.schools = schools);

        this.periods = [
            { year: 2016, period: 1 },
            { year: 2015, period: 3 },
            { year: 2015, period: 2 },
        ];
        this.period = this.periods[0]; // present
        this.courses = null;

        this.manager.source().first().subscribe(schedules => {
            // Only if no query has been made.
            if (!this.query.campus && !this.query.school) {
                const courses = schedules.reduce((array, schedule) => {
                    array.push(...schedule.iterableCourses);
                    return array;
                }, []);
                if (courses.length) {
                    this.process(courses);
                    this.operation = false;
                } else {
                    const placeholders = ["MAT0", "LET0", "DPT", "TTF0", "DNO0", "DER0", "EDU0"];
                    const random = placeholders[Math.floor(Math.random() * placeholders.length)];
                    this.search({ initials: random });
                }
            }
        });
    }

    course(school: string): Course[] {
        return this.courses[school];
    }

    onSearch(query) {
        if (this.keyboard.isOpen()) {
            this.keyboard.close();
        }
        this.search(Object.assign(query, this.query));
    }

    search(query?) {
        query = query || this.query;
        const request: SearchQuery = {
            period: this.period.period,
            year: this.period.year,
        };

        const valid = (input) => (typeof(input) === "string" || input instanceof String) && input.length !== 0;
        if (valid(query.name)) { request.name = query.name; }
        if (valid(query.campus)) { request.campus = query.campus; }
        if (valid(query.school)) { request.school = query.school; }
        if (valid(query.initials)) { request.initials = query.initials; }

        this.operation = true;
        this.provider.search(request).subscribe(
            courses => this.process(courses),
            err => console.error(err),
            () => this.operation = false);
    }

    process(results: Course[]): Course[][] {
        const hash = {};
        results.forEach(course => {
            if (!hash[course.school]) {
                hash[course.school] = [course];
            } else {
                hash[course.school].push(course);
            }
        });
        return this.courses = Object.keys(hash).map(school => hash[school]);
    }

    addToSchedule(course: Course) {
        const modal = Modal.create(AddRemovePage, { course: course });
        this.nav.present(modal);
    }

    selectCourse(course: Course) {
        this.nav.push(SectionPage, { course: course });
    }

    selectPeriod() {
        const alert = Alert.create({
            title: "Selecciona periodo",
            inputs: this.periods.map((period, index) => ({
                type: "radio",
                value: String(index),
                label: HumanizePeriodPipe.transform(period),
                checked: this.period === period,
            })),
            buttons: [
                "Cancelar",
                {
                    text: "Seleccionar",
                    handler: data => this.period = this.periods[Number(data)],
                }
            ],
            enableBackdropDismiss: true,
        });
        this.nav.present(alert);
    }
}
