import {App, Platform, Page} from "ionic-angular";

// Main page
import {TabsPage} from "./pages/tabs/tabs";

// Global Providers
import {CoursesProvider} from "./providers/courses";
import {SchedulesProvider} from "./providers/schedules";

@App({
    templateUrl: "build/app.html",
    config: {
        // overflowScroll: true,
        // mode: "md",
    },
    prodMode: process.env.NODE_ENV === "production",
    providers: [CoursesProvider, SchedulesProvider],
})
export class MyApp {
    private root = TabsPage;

    constructor(
        private platform: Platform,
        private provider: CoursesProvider,
        private manager: SchedulesProvider) {

        // Setup Web API URL:
        this.provider.url = process.env.API_URL;

        this.platform.ready().then(() => {
            // Do any necessary cordova or native calls here now that the platform is ready
            this.provider.setup("courses", { searchable: true }).info()
                .then(JSON.stringify)
                .then(info => console.log(`CoursesDB: ${info}`));

            this.manager.setup("schedules").info()
                .then(JSON.stringify)
                .then(info => console.log(`SchedulesDB: ${info}`));
        });
    }
}
