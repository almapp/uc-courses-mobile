import {Component} from "angular2/core";
import {Item} from "ionic-framework/ionic";

@Component({
  selector: "course-item",
  templateUrl: "build/components/course-item/course-item.html",
  directives: [Item]
})
export class CourseItem {
  constructor() {
      // ...
  }
}
