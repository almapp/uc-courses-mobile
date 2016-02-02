import {Page, NavController, NavParams, Modal, ActionSheet, ViewController} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

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

    static transform(period: Period): String {
        return `${period.year}-${HumanizePeriodPipe.TABLE[period.period]}`;
    }

    transform(period: Period, args: string[]): String {
        return HumanizePeriodPipe.transform(period);
    }
}

@Page({
    templateUrl: "build/pages/courses/courses.html",
    pipes: [HumanizePeriodPipe],
    directives: [CourseItem],
})
export class CoursesPage {
    private period: Period;
    private periods: Period[];
    private campuses: string[];

    private courses: Course[][];
    private schools: string[];

    private query = {
        initials: "",
        name: "",
        campus: "",
        school: "",
    };
    private operation: Promise<any>;

    constructor(
        private nav: NavController,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        this.campuses = [];
        this.provider.campuses().then(campuses => this.campuses = campuses.sort());

        this.schools = [];
        this.provider.schools().then(schools => this.schools = schools.sort());

        this.periods = [
            { year: 2016, period: 1 },
            { year: 2015, period: 3 },
            { year: 2015, period: 2 },
        ];
        this.period = this.periods[0]; // present
        this.courses = null;

        this.manager.loadAll().then(schedules => {
            const courses = schedules.reduce((array, schedule) => {
                array.push(...schedule.courses);
                return array;
            }, []);
            if (courses.length) {
                this.process(courses);
                this.operation = null;
            } else {
                const placeholders = ["MAT0", "LET0", "DPT", "TTF0", "DNO0", "DER0", "EDU0"];
                const random = placeholders[Math.floor(Math.random() * placeholders.length)];
                this.search({ initials: random });
            }
        });
    }

    course(school: string): Course[] {
        return this.courses[school];
    }

    search(query?) {
        query = query || this.query;
        const request: SearchQuery = {
            period: this.period.period,
            year: this.period.year,
        };

        const valid = (input) => (typeof(input) === "string" || input instanceof String) && input.length !== 0;
        if (valid(query.name)) { request.name = query.name; }
        if (valid(query.campus)) { request.campus = query.campus; }
        if (valid(query.school)) { request.school = query.school; }
        if (valid(query.initials)) { request.initials = query.initials; }

        this.operation = this.provider.search(request).then(courses => {
            this.process(courses);
            this.operation = null;
        }).catch(err => this.operation = null);
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
        const buttons = [...this.periods.map(period => ({
            text: HumanizePeriodPipe.transform(period),
            role: null,
            handler: () => this.period = period,
        })), {
            text: "Cancelar",
            role: "cancel",
            handler: null,
        }];

        const sheet = ActionSheet.create({
            title: "Selecciona periodo",
            buttons: buttons,
        });
        this.nav.present(sheet);
    }

    selectCampus() {
        const buttons = [...this.campuses.map(campus => ({
            text: campus,
            role: null,
            handler: () => this.query.campus = campus,
        })), {
            text: "Todos",
            role: "cancel",
            handler: () => this.query.campus = null,
        }];

        const sheet = ActionSheet.create({
            title: "Selecciona un campus",
            buttons: buttons,
        });
        this.nav.present(sheet);
    }

    selectSchool() {
        const modal = Modal.create(SchoolListPage, { schools: this.schools });
        modal.onDismiss((school: string) => this.query.school = school);
        this.nav.present(modal);
    }
}

@Page({
    template: `
    <ion-toolbar>
      <ion-buttons end>
        <button (click)="close()">
          Todas
        </button>
      </ion-buttons>
      <ion-title>Escuelas</ion-title>
    </ion-toolbar>

    <ion-content>
      <ion-list>
        <ion-item *ngFor="#school of schools" (click)="close(school)">
          <ion-icon [name]="provider.icon(school) || 'school'" item-left></ion-icon>
          {{school}}
        </ion-item>
      </ion-list>
    </ion-content>
    `,
})
export class SchoolListPage {
    private schools: string[];

    constructor(private view: ViewController, private params: NavParams, private provider: CoursesProvider) {
        this.schools = this.params.get("schools");
    }

    close(school?: string) {
        this.view.dismiss(school);
    }
}
