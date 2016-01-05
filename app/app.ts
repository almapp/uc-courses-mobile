import {App, Platform, Page} from "ionic-framework/ionic";

// Pages
import {CoursesPage} from "./pages/courses/courses";
import {SchedulerPage} from "./pages/scheduler/scheduler";
import {TeachersPage} from "./pages/teachers/teachers";

interface Tab {
    title: string;
    page: any;
}

@App({
    templateUrl: "build/app.html",
    config: {
        // overflowScroll: true,
        // mode: "md",
    },
})
export class MyApp {
    private tabs = [
        { title: "Buscacursos", page: CoursesPage },
        { title: "Horarios", page: SchedulerPage },
        { title: "Profesores", page: TeachersPage },
    ];

    constructor(platform: Platform) {
        platform.ready().then(() => {
            // Do any necessary cordova or native calls here now that the platform is ready
        });
    }
}
