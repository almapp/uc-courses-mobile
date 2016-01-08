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
        course.teachers = json.teachers || [];
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

    // TODO: review keys (school names)
    static icon(school: string): string {
        switch (school.trim().toLowerCase()) {
            case "actuación": return "bowtie";
            case "agronomia e ing. forestal": return "leaf";
            case "arquitectura": return "crop";
            case "arte": return "color-palette";
            case "astrofisica": return "planet";
            case "cara": return "body";
            case "ciencia política": return "bookmark";
            case "ciencias biológicas": return "bug";
            case "ciencias de la salud": return "medkit";
            case "ciencias económicas y administrativas": return "cash";
            case "comunicaciones": return "chatbubbles";
            case "construcción civil": return "settings";
            case "cursos deportivos": return "football";
            case "derecho": return "briefcase";
            case "diseño": return "images";
            case "educación": return "star";
            case "enfermería": return "pulse";
            case "estudios urbanos": return "pin";
            case "estética": return "rose";
            case "filosofía": return "person";
            case "física": return "calculator";
            case "geografía": return "map";
            case "historia": return "clock";
            case "ingeniería": return "laptop";
            case "letras": return "book";
            case "matemática": return "cube";
            case "medicina": return "thermometer";
            case "música": return "musical-note";
            case "odontología": return "clipboard";
            case "psicología": return "help";
            case "química": return "beaker";
            case "sociología": return "people";
            case "teología": return "egg";
            case "trabajo social": return "happy";
            case "villarica": return "image";
            default: return "university";
        }
    }
}
