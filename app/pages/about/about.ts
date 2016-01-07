import {Page} from "ionic-framework/ionic";
import {Http} from "angular2/http";

var PACKAGE = require("../../../package.json");

@Page({
    templateUrl: "build/pages/about/about.html",
})
export class AboutPage {
    private meta: any;
    private information = [];

    constructor(private http: Http) {
        this.http.get("build/js/" + PACKAGE).subscribe(res => {
            this.meta = res.json();
            this.information = [
                { name: "Nombre", value: this.meta.name },
                { name: "Versión", value: this.meta.version },
                { name: "Licencia", value: this.meta.license },
            ];
        });
    }

    open(url: string) {
        window.open(url, "_system");
    }
}
