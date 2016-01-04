import {Page, NavController, NavParams} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course} from "../../models/course";
import {Block} from "../../models/schedule";
import {CoursesProvider} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {SectionView} from "../../components/section-view/section-view";

interface Module {
    type: string;
    blocks: Block[];
    classroom: string;
}

@Page({
    templateUrl: "build/pages/section/section.html",
    directives: [SectionView],
    providers: [CoursesProvider, SchedulesProvider],
})
export class SectionPage {
    course: Course;
    sections: Course[];
    currentSection: number;

    modules: Module[][];

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        this.course = this.navParams.data;

        this.provider.sections({ course: this.course }).then(sections => {
            sections = sections.sort((a, b) => a.section - b.section);
            this.currentSection = sections.map(s => s.section).indexOf(this.course.section);
            this.sections = sections;
        });
    }

    selectSection(section: number) {
        this.currentSection = section;
        this.course = this.sections[this.currentSection];
    }
}
