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

export interface Block {
    day: string;
    hours: number[];
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

export const MODULES = [
    "CAT",
    "TALL",
    "LAB",
    "AYUD",
    "PRAC",
    "TERR",
    "TES",
    "OTRO",
];

export const DAYS = [
    "L",
    "M",
    "W",
    "J",
    "V",
    "S",
    "D",
];

export class Course {
    static NO_PLACE = "?";
    static NO_CAMPUS = "Sin campus";

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

    /**
     * Get all teachers by name.
     * @return {string[]} Names.
     */
    get teachersNames(): string[] {
        return this.teachers.map(t => t.name);
    }

    /**
     * Get all modules that has classes in it.
     * For example, LAB is ignored if lab has no hours.
     * @return {string[]} Array of Modules.
     */
    get activeModules(): string[] {
        return Object.keys(this.schedule);
    }

    /**
     * For a given module type, like CAT, get the days which has classes in it.
     * @param  {string}   modtype Module type (i.e. AYUD).
     * @return {string[]}         Days (i.e. L, M, V).
     */
    workingDays(modtype: string): string[] {
        return Object.keys(this.schedule[modtype].modules);
    }

    /**
     * Get the location name where takes places.
     * @param  {string} modtype Module type (i.e. AYUD).
     * @return {string}         Place name
     */
    place(modtype: string): string {
        const mod = this.schedule[modtype];
        const place = mod ? mod.location.place : null;
        return place ? place : Course.NO_PLACE;
    }

    /**
     * Get the campus name where takes places.
     * @param  {string} modtype Module type (i.e. AYUD).
     * @return {string}         Campus name
     */
    campus(modtype: string): string {
        const mod = this.schedule[modtype];
        const campus = mod ? mod.location.campus : null;
        return campus ? campus : Course.NO_CAMPUS;
    }

    /**
     * Get the blocks of classes for a given module type.
     * Ask for CAT and recieve [{ L, [1,3,4] }, { M, [1] }]
     * @param  {string}  modtype Module type (i.e. AYUD).
     * @return {Block[]}         Blocks
     */
    blocks(modtype: string): Block[] {
        const mods = this.schedule[modtype].modules;
        return this.workingDays(modtype).map(day => {
            return {
                day: day,
                hours: mods[day],
            };
        });
    }

    /**
     * Parse a JSON from the REST API to a native object.
     * @param  {any}    json JSON Object.
     * @return {Course}      Instance of class.
     */
    static parse(json: any): Course {
        const course = new Course();
        course._id = json._id;
        course.name = json.name;
        course.year = json.year;
        course.period = json.period;
        course.NRC = json.NRC;
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
        course.schedule = {};
        if (json.schedule) {
            MODULES.forEach(mod => {
                if (json.schedule[mod]) {
                    course.schedule[mod] = {
                        location: json.schedule[mod].location,
                        modules: {},
                    };
                    const schema: ScheduleSchema = json.schedule[mod];
                    const mods = schema.modules;
                    DAYS.forEach(day => {
                        const blocks = mods[day];
                        if (blocks && blocks.length !== 0) {
                            course.schedule[mod].modules[day] = blocks;
                        }
                    });
                }
            });
        }
        course.requisites = json.requisites;
        return course;
    }
}

export const ICONS = {
    "actuación": "bowtie",
    "agronomia e ing. forestal": "leaf",
    "arquitectura": "crop",
    "arte": "color-palette",
    "astrofisica": "planet",
    "cara": "body",
    "ciencia política": "bookmark",
    "ciencias biológicas": "bug",
    "ciencias de la salud": "medkit",
    "ciencias económicas y administrativas": "cash",
    "comunicaciones": "chatbubbles",
    "construcción civil": "settings",
    "cursos deportivos": "football",
    "derecho": "brief",
    "diseño": "images",
    "educación": "star",
    "enfermería": "pulse",
    "estudios urbanos": "pin",
    "estética": "rose",
    "filosofía": "person",
    "física": "calculator",
    "geografía": "map",
    "historia": "clock",
    "ingeniería": "laptop",
    "letras": "book",
    "matemática": "cube",
    "medicina": "thermometer",
    "música": "musical-note",
    "odontología": "clipboard",
    "psicología": "help",
    "química": "beaker",
    "sociología": "people",
    "teología": "egg",
    "trabajo social": "happy",
    "villarica": "image",
};
