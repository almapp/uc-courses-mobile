import {Page} from "ionic-framework/ionic";
import {Http} from "angular2/http";
import * as crypto from "crypto";

var PACKAGE = require("../../../package.json");

@Page({
    templateUrl: "build/pages/about/about.html",
})
export class AboutPage {
    private meta: any;
    private policy = "https://almapp.github.io/buscacursos-uc-mobile/policy";

    constructor(private http: Http) {
        this.http.get("build/js/" + PACKAGE).subscribe(res => {
            this.meta = res.json();
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
