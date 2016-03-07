import {Block} from "./schedule";

export interface Teacher {
    name: string;
    photoURL: string;
}

export interface CourseRestriction {
    type: string;
    value: string;
}

export interface CourseRequirement {
    prerequisites: string[];
    corequisites: string[];
}

export interface ModuleSchema {
    day: string;
    hours: number[];
}

export interface ScheduleSchema {
    identifier: string;
    modules: [ModuleSchema];
    location: {
        campus: string;
        place: string;
    };
}

export class Course {
    _id: string;
    _rev: string;
    name: string;
    year: number;
    period: number;
    NRC: string;
    initials: string;
    section: number;
    school: string;
    droppable: boolean;
    english: boolean;
    specialApproval: boolean;
    teachers: Teacher[];
    credits: number;
    information: string;
    vacancy: {
        total: number;
        available: number;
    };
    schedule: [ScheduleSchema];
    requisites: {
        requirements?: CourseRequirement[];
        relation?: string;
        restrictions?: string;
        equivalences?: string[];
    };

    /**
     * Get all teachers by name.
     * @return {string[]} Names.
     */
    get teachersName(): string[] {
        return this.teachers.map(t => t.name);
    }

    get blocks(): Block[] {
        const blocks = [];
        this.schedule.forEach(schedule => {
            schedule.modules.forEach(mod => {
                mod.hours.forEach(hour => {
                    blocks.push({
                        day: mod.day,
                        block: hour,
                        modtype: schedule.identifier,
                        NRC: this.NRC,
                    });
                });
            });
        });
        return blocks;
    }

    /**
     * Get all modules that has classes in it.
     * For example, LAB is ignored if lab has no hours.
     * @return {string[]} Array of Modules.
     */
    // get activeModules(): string[] {
    //     return Object.keys(this.schedule);
    // }

    /**
     * For a given module type, like CAT, get the days which has classes in it.
     * @param  {string}   modtype Module type (i.e. AYUD).
     * @return {string[]}         Days (i.e. L, M, V).
     */
    // workingDays(modtype: string): string[] {
    //     return Object.keys(this.schedule[modtype].modules);
    // }

    /**
     * Get the location name where takes places.
     * @param  {string} modtype Module type (i.e. AYUD).
     * @return {string}         Place name
     */
    place(modtype: string): string {
        const mod = this.schedule.find(s => s.identifier === modtype);
        return mod ? mod.location.place : null;
    }

    /**
     * Get the campus name where takes places.
     * @param  {string} modtype Module type (i.e. AYUD).
     * @return {string}         Campus name
     */
    campus(modtype: string): string {
        const mod = this.schedule.find(s => s.identifier === modtype);
        return mod ? mod.location.campus : null;
    }

    static compare(a: Course, b: Course): number {
        if (a.initials < b.initials) return -1;
        else if (a.initials > b.initials) return 1;
        else return 0;
    }

    /**
     * Add and change properties to worki with PouchDB
     */
    static prepare(json: any): any {
        return Object.assign(json, { _id: String(json.NRC), _rev: "1-rev", __v: undefined });
    }

    /**
     * Parse a JSON from the REST API to a native object.
     * @param  {any}    json JSON Object.
     * @return {Course}      Instance of class.
     */
    static parse(json: any): Course {
        if (!json) return null;

        const course = new Course();
        course._id = String(json.NRC || json._id);
        course._rev = String(json._rev) || "1-rev";
        course.name = json.name;
        course.year = json.year;
        course.period = json.period;
        course.NRC = String(json.NRC);
        course.initials = json.initials;
        course.section = json.section;
        course.school = json.school;
        course.droppable = json.droppable;
        course.english = json.english;
        course.specialApproval = json.specialApproval;
        course.teachers = json.teachers ||  [];
        course.credits = json.credits;
        course.information = json.information;
        course.vacancy = json.vacancy;
        course.schedule = json.schedule || [];
        course.requisites = json.requisites;
        return course;
    }
}
