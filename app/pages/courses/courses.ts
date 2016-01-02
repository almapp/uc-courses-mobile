import {Page, NavController, ActionSheet} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider, SearchQuery ,Period, Campus} from "../../providers/courses";
import {CourseItem} from "../../components/course-item/course-item";

@Pipe({
    name: "periodize"
})
export class HumanizePeriodPipe {
    public static table = {
        "1": "1",
        "2": "2",
        "3": "TAV",
    };

    static transform(period: Period): String {
        return `${period.year}-${HumanizePeriodPipe.table[period.period]}`;
    }

    transform(period: Period, args: string[]): String {
        return HumanizePeriodPipe.transform(period);
    }
}

@Page({
    templateUrl: "build/pages/courses/courses.html",
    pipes: [HumanizePeriodPipe],
    directives: [CourseItem],
    providers: [CoursesProvider],
})
export class CoursesPage {
    private period: Period;
    private periods: Period[];

    private campus: Campus;
    private campuses: Campus[];

    private courses: Course[];

    constructor(
        private provider: CoursesProvider,
        private actionSheet: ActionSheet,
        private nav: NavController) {

        this.campuses = [
            { name: "San Joaquín", identifier: "SJ" },
            { name: "Casa Central", identifier: "CC" },
            { name: "Lo Contador", identifier: "LC" },
        ];
        this.campus = null;

        this.periods = [
            { year: 2016, period: 1 },
            { year: 2015, period: 3 },
            { year: 2015, period: 2 },
        ];
        this.period = this.periods[0];
    }

    search(query: string) {
        const request: SearchQuery = {
            campus: this.campus,
            initials: query,
        };
        this.provider.search(this.period, request).then(results => {
            this.courses = results;
        });
    }

    selectPeriod() {
        this.actionSheet.open({
            titleText: "Selecciona periodo",
            buttons: this.periods.map(p => {
                return { text: HumanizePeriodPipe.transform(p) };
            }),
            cancelText: "Cancelar",
            buttonClicked: (index) => {
                this.period = this.periods[index];
                return true;
            },
        });
    }

    selectCampus() {
        this.actionSheet.open({
            titleText: "Selecciona periodo",
            buttons: this.campuses.map(c => {
                return { text: c.name };
            }),
            cancelText: "Todos",
            buttonClicked: (index) => {
                this.campus = this.campuses[index];
                return true;
            },
            cancel: () => {
                this.campus = null;
                return true;
            },
        });
    }
}
