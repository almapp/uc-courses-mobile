import {Page, NavController, NavParams, Modal} from "ionic-framework/ionic";
import {Pipe} from "angular2/core";

import {Course} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";
import {SchedulesProvider} from "../../providers/schedules";
import {SectionView} from "../../components/section-view/section-view";
import {AddRemovePage} from "../add-remove/add-remove";
import {SectionListPage} from "../section-list/section-list";

@Page({
    templateUrl: "build/pages/section/section.html",
    directives: [SectionView],
})
export class SectionPage {
    course: Course;
    sections: Course[];
    current: number;

    constructor(
        private nav: NavController,
        private navParams: NavParams,
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
        const modal = Modal.create(SectionListPage, { sections: this.sections });
        modal.onDismiss((section: Course) => {
            const index = this.sections.indexOf(section);
            if (index >= 0) {
                this.selectSection(index);
            }
        });
        this.nav.present(modal);
    }

    selectSection(section: number) {
        this.current = section;
        this.course = this.sections[this.current];
    }

    manage() {
        const modal = Modal.create(AddRemovePage, { course: this.course });
        this.nav.present(modal);
    }
}
