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

export interface ScheduleSchema {
    modules: {
        L: number[];
        M: number[];
        W: number[];
        J: number[];
        V: number[];
        S: number[];
        D: number[];
    };
    location: {
        campus: string;
        place: string;
    };
}

export class Course {
    _id: string;
    name: string;
    year: number;
    period: number;
    NRC: number;
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
        relation?: string;
        restrictions?: string;
        equivalences?: string[];
    };
}
