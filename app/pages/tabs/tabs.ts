import {Platform, Page, Nav} from "ionic-framework/ionic";

// Pages
import {CoursesPage} from "../courses/courses";
import {SchedulerPage} from "../scheduler/scheduler";
import {AboutPage} from "../about/about";

@Page({
    templateUrl: "build/pages/tabs/tabs.html",
})
export class TabsPage {
    private tabs = [
        { title: "Buscacursos", page: CoursesPage, icon: "search" },
        { title: "Horarios", page: SchedulerPage, icon: "calendar" },
        { title: "Información", page: AboutPage, icon: "information-circle" },
    ];

    constructor(platform: Platform) {
        if (!platform.is("ios")) {
            this.tabs.forEach( t => delete t.icon );
        }
    }
}
