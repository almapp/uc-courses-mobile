import {Page, NavController, Modal, ActionSheet} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course, ICONS} from "../../models/course";
import {CoursesProvider, FullSearchQuery, Period, Campus} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {CourseItem} from "../../components/course-item/course-item";

import {SectionPage} from "../section/section";
import {AddRemovePage} from "../add-remove/add-remove";

interface CourseGroup {
    [ Identifier: string ]: Course[];
}

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

    private campus: Campus;
    private campuses: Campus[];

    private courses: CourseGroup;
    private schools: string[];
    private icons = ICONS;

    constructor(
        private nav: NavController,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        this.campuses = [
            { name: "San Joaquín", identifier: "SJ" },
            { name: "Casa Central", identifier: "CC" },
            { name: "Lo Contador", identifier: "LC" },
            { name: "Oriente", identifier: "OR" },
            { name: "Villarrica", identifier: "VR" },
            { name: "Campus Externo", identifier: "CE" },
        ];
        this.campus = null;

        this.periods = [
            { year: 2016, period: 1 },
            { year: 2015, period: 3 },
            { year: 2015, period: 2 },
        ];
        this.period = this.periods[0];
        this.courses = null;

        this.manager.loadAll().then(schedules => {
            const courses = schedules.reduce((array, schedule) => {
                array.push(...schedule.courses);
                return array;
            }, []);
            if (courses.length) {
                this.process(courses);
            } else {
                const placeholders = ["MAT0", "LET0", "DPT", "TTF0", "DNO0", "DER0", "EDU0"];
                this.search(placeholders[Math.floor(Math.random() * placeholders.length)]);
            }
        });
    }

    course(school: string): Course[] {
        return this.courses[school];
    }

    search(query: string) {
        const request: FullSearchQuery = {
            q: query,
            campus: this.campus,
        };
        this.provider.fullSearch(this.period, request).then(courses => this.process(courses));
    }

    process(results: Course[]): string[] {
        this.courses = {};
        results.forEach(course => {
            if (!this.courses[course.school]) {
                this.courses[course.school] = [course];
            } else {
                this.courses[course.school].push(course);
            }
        });
        return this.schools = Object.keys(this.courses);
    }

    addToSchedule(course: Course) {
        const modal = Modal.create(AddRemovePage, { course: course });
        this.nav.present(modal);
    }

    selectCourse(course: Course) {
        this.nav.push(SectionPage, {
            course: course
        }, { direction: "forward" }, undefined);
    }

    selectPeriod() {
        const buttons = this.periods.map(period => {
            return {
                text: HumanizePeriodPipe.transform(period),
                style: null,
                handler: () => this.period = period,
            };
        }).concat({
            text: "Cancelar",
            style: "cancel",
            handler: null,
        });

        const sheet = ActionSheet.create({
            title: "Selecciona periodo",
            buttons: buttons,
        });
        this.nav.present(sheet);
    }

    selectCampus() {
        const buttons = this.campuses.map(campus => {
                return {
                    text: campus.name,
                    style: null,
                    handler: () => this.campus = campus,
                };
        }).concat({
            text: "Todos",
            style: "cancel",
            handler: () => this.campus = null,
        });

        const sheet = ActionSheet.create({
            title: "Selecciona un campus",
            buttons: buttons,
        });
        this.nav.present(sheet);
    }
}
