import {App, Platform, Page} from "ionic-framework/ionic";

// Pages
import {CoursesPage} from "./pages/courses/courses";
import {SchedulerPage} from "./pages/scheduler/scheduler";
import {AboutPage} from "./pages/about/about";

// Global Providers
import {CoursesProvider} from "./providers/courses";
import {SchedulesProvider} from "./providers/schedules";

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
    providers: [CoursesProvider, SchedulesProvider],
})
export class MyApp {
    private tabs = [
        { title: "Horarios", page: SchedulerPage },
        { title: "Buscacursos", page: CoursesPage },
        { title: "Información", page: AboutPage },
    ];

    constructor(private platform: Platform, private provider: CoursesProvider) {
        this.provider.url = process.env.API_URL;
        this.platform.ready().then(() => {
            // Do any necessary cordova or native calls here now that the platform is ready
        });
    }
}
