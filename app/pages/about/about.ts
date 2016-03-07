import {Page} from "ionic-angular";
import {Http} from "angular2/http";
import {SchedulesProvider} from "../../providers/schedules";
import * as crypto from "crypto";

const PACKAGE = require("../../../package.json");

@Page({
    templateUrl: "build/pages/about/about.html",
})
export class AboutPage {
    private meta: any;
    private adapter: string = "Cargando...";

    constructor(private http: Http, manager: SchedulesProvider) {
        this.http.get("build/js/" + PACKAGE).subscribe(res => {
            this.meta = res.json();
        });
        manager.info().then(info => {
            this.adapter = `${info.adapter}${info.sqlite_plugin ? " (sql)" : ""}`;
        }).catch(err => {
            console.error(err);
            this.adapter = "Error";
        });
    }

    image(email: string): string {
        const hash = crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
        const url = `http://www.gravatar.com/avatar/${hash}.png`;
        return url;
    }

    open(url: string) {
        window.open(url, "_system");
    }
}
