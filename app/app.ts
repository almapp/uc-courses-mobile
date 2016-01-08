import {App, Platform, Page} from "ionic-framework/ionic";

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
    providers: [CoursesProvider, SchedulesProvider],
})
export class MyApp {
    private root = TabsPage;

    constructor(private platform: Platform, private provider: CoursesProvider, private manager: SchedulesProvider) {
        this.provider.url = process.env.API_URL;
        this.platform.ready().then(() => {
            // Do any necessary cordova or native calls here now that the platform is ready
        });
    }
}
