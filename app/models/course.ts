export interface Teacher {
    name: String;
    photoURL: String;
}

export interface CourseRestriction {
    type: String;
    value: String;
}

export interface CourseRequirement {
    prerequisites: String[];
    corequisites: String[];
}

export interface ScheduleSchema {
    modules: {
        L: Number[];
        M: Number[];
        W: Number[];
        J: Number[];
        V: Number[];
        S: Number[];
        D: Number[];
    };
    location: {
        campus: String;
        place: String;
    };
}

export class Course {
    _id: String;
    name: String;
    year: Number;
    period: Number;
    NRC: Number;
    initials: String;
    section: number;
    school: String;
    droppable: Boolean;
    english: Boolean;
    specialApproval: Boolean;
    teachers: Teacher[];
    credits: Number;
    information: String;
    vacancy: {
        total: Number;
        available: Number;
    };
    schedule: {
        CAT?: ScheduleSchema,
        TALL?: ScheduleSchema,
        LAB?: ScheduleSchema,
        AYUD?: ScheduleSchema,
        PRAC?: ScheduleSchema,
        TERR?: ScheduleSchema,
        TES?: ScheduleSchema,
        OTRO?: ScheduleSchema,
    };
    requisites: {
        requirements?: CourseRequirement[];
        relation?: String;
        restrictions?: String;
        equivalences?: String[];
    };
}
