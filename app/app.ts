import {App, Platform, Page} from "ionic-framework/ionic";
import {CoursesPage} from "./pages/courses/courses";
import {SchedulerPage} from "./pages/scheduler/scheduler";
import {TeachersPage} from "./pages/teachers/teachers";


@App({
    templateUrl: "build/app.html",
    config: {
        // overflowScroll: true,
        // mode: "md",
    },
})
export class MyApp {
    private coursesTab = CoursesPage;
    private schedulerTab = SchedulerPage;
    private teachersTab = TeachersPage;

    constructor(platform: Platform) {
        platform.ready().then(() => {
            // Do any necessary cordova or native calls here now that the platform is ready
        });
    }
}
