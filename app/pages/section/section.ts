import {Page, NavController, NavParams, Modal} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course} from "../../models/course";
import {Block} from "../../models/schedule";
import {CoursesProvider} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {SectionView} from "../../components/section-view/section-view";
import {AddRemovePage} from "../add-remove/add-remove";
import {SectionListPage} from "../section-list/section-list";

interface Module {
    type: string;
    blocks: Block[];
    classroom: string;
}

@Page({
    templateUrl: "build/pages/section/section.html",
    directives: [SectionView],
})
export class SectionPage {
    course: Course;
    sections: Course[];
    current: number;

    modules: Module[][];

    constructor(
        private nav: NavController,
        private navParams: NavParams,
        private modal: Modal,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        this.course = this.navParams.get("course");

        this.provider.sections({ course: this.course }).then(sections => {
            sections = sections.sort((a, b) => a.section - b.section);
            this.current = sections.map(s => s.section).indexOf(this.course.section);
            this.sections = sections;
        });
    }

    viewSections() {
        this.modal.open(SectionListPage, {
            sections: this.sections,
        });
    }

    selectSection(section: number) {
        this.current = section;
        this.course = this.sections[this.current];
    }

    manage() {
        this.modal.open(AddRemovePage, {
            course: this.course,
        });
    }
}
