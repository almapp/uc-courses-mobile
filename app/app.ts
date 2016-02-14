import {App, Platform, Page} from "ionic-framework/ionic";
import {enableProdMode} from "angular2/core";

// Main page
import {TabsPage} from "./pages/tabs/tabs";

// Global Providers
import {CoursesProvider} from "./providers/courses";
import {SchedulesProvider} from "./providers/schedules";

if (process.env.NODE_ENV === "production") {
    enableProdMode();
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
    private root = TabsPage;

    constructor(private platform: Platform, private provider: CoursesProvider, private manager: SchedulesProvider) {
        this.provider.url = process.env.API_URL;
        this.platform.ready().then(() => {
            // Do any necessary cordova or native calls here now that the platform is ready
            manager.setup();
        });
    }
}
