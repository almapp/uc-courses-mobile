import {Component, Input} from "angular2/core";
import {Item, Icon, List} from "ionic-framework/ionic";

import {Course, Block} from "../../models/course";
import {CoursesProvider} from "../../providers/courses";


@Component({
    selector: "section-view",
    templateUrl: "build/components/section-view/section-view.html",
    directives: [List, Item, Icon],
    providers: [CoursesProvider],
})
export class SectionView {
    @Input() section: Course;

    constructor(private provider: CoursesProvider) {
        // ...
    }

    ngOnInit() {
        // ...
    }
}
