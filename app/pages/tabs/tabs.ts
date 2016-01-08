import {Page, Nav} from "ionic-framework/ionic";

// Pages
import {CoursesPage} from "../courses/courses";
import {SchedulerPage} from "../scheduler/scheduler";
import {AboutPage} from "../about/about";

@Page({
    templateUrl: "build/pages/tabs/tabs.html",
})
export class TabsPage {
    private tabs = [
        { title: "Horarios", page: SchedulerPage },
        { title: "Buscacursos", page: CoursesPage },
        { title: "Información", page: AboutPage },
    ];

    constructor() {
        // ...
    }
}
