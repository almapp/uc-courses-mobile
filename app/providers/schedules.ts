import {Storage, SqlStorage} from "ionic-framework/ionic";
import {Injectable} from "angular2/core";
import {createHash} from "crypto";

import {Course, ScheduleSchema} from "../models/course";
import {Schedule} from "../models/schedule";

export interface Schedules {
    [ Identifier: string ]: Schedule;
}

@Injectable()
export class SchedulesProvider {
    database: string;
    storage: Storage;

    schedules: Schedules;
    names: string[];

    constructor() {
        this.database = "buscacursos-uc";
        this.storage = new Storage(<any>SqlStorage, { name: this.database });
        this.schedules = {};
    }

    static nameToID(name: string): string {
        return createHash("md5").update(name).digest("hex");
    }

    save(schedule: Schedule): Promise<void> {
        return this.storage.set(SchedulesProvider.nameToID(schedule.name), JSON.stringify(schedule));
    }

    create(name: string, position?: number, courses?: Course[]): Promise<Schedule> {
        const schedule = new Schedule(name, position || 0, courses);
        return this.save(schedule).then(() => {
            // Save object
            return this.loadNames();
        }).then(names => {
            // Save name
            names.push(name);
            this.names = names;
            return this.storage.set("NAMES", JSON.stringify(names));
        }).then(() => {
            // Return on success
            return schedule;
        });
    }

    loadNames(): Promise<string[]> {
        return (this.names) ? Promise.resolve(this.names) : this.storage.get("NAMES").then(names => {
            this.names = (names && names.length) ? JSON.parse(names) : ["default"];
            return this.names;
        });
    }

    loadSchedule(name: string): Promise<Schedule> {
        const ID = SchedulesProvider.nameToID(name);
        return (this.schedules[ID]) ? Promise.resolve(this.schedules[ID]) : this.storage.get(ID).then(schedule => {
            if (schedule) {
                this.schedules[ID] = JSON.parse(schedule);
            } else if (name === "default") {
                this.schedules[ID] = new Schedule("Propio", 0, [Course.parse(JSON.parse(
                    `

{
    "_id": "5687e496b33aaece39c8972e",
    "updatedAt": "2016-01-02T14:54:14.000Z",
    "createdAt": "2016-01-02T14:54:14.000Z",
    "year": 2016,
    "period": 1,
    "NRC": 10760,
    "initials": "IIC2233",
    "section": 1,
    "name": "Programación Avanzada",
    "credits": 10,
    "school": "Ingeniería",
    "information": "Este curso enseña técnicas para el diseñar, códificar, probar y evaluar programas que resuelven problemas algorítmicos a partir de las especificaciones detalladas. En particular, el curso enseña algunas construcciones avanzadas de programación orientada a objetos no incluidas en el curso introductorio, algunas estructuras de datos fundamentales, diseño básico de algoritmos y técnicas de análisis. Los estudiantes deben usar una serie de herramientas de programación para desarrollar sus programas.",
    "requisites": {
        "relation": null,
        "equivalences": [
            "IIC1222"
        ],
        "restrictions": [],
        "requirements": [
            {
                "corequisites": [],
                "prerequisites": [
                    "IIC1103"
                ]
            },
            {
                "corequisites": [],
                "prerequisites": [
                    "IIC1102"
                ]
            }
        ]
    },
    "schedule": {
        "CAT": {
            "location": {
                "campus": "San Joaquin",
                "place": "L4"
            },
            "modules": {
                "D": [],
                "S": [],
                "V": [],
                "J": [
                    4,
                    5
                ],
                "W": [],
                "M": [],
                "L": []
            }
        },
        "AYUD": {
            "location": {
                "campus": "San Joaquin",
                "place": "BC24"
            },
            "modules": {
                "D": [],
                "S": [],
                "V": [],
                "J": [],
                "W": [],
                "M": [],
                "L": [
                    6
                ]
            }
        }
    },
    "vacancy": {
        "total": 70,
        "available": 15
    },
    "teachers": [
        {
            "name": "Pichara Karim",
            "photoURL": "http://buscacursos.uc.cl/getFotoProfe.db.php?nombre=Pichara%20Karim&semestre=2016-1&sigla=IIC2233&seccion=1"
        },
        {
            "name": "Reutter Juan",
            "photoURL": "http://buscacursos.uc.cl/getFotoProfe.db.php?nombre=Reutter%20Juan&semestre=2016-1&sigla=IIC2213&seccion=1"
        }
    ],
    "specialApproval": false,
    "english": false,
    "droppable": true,
    "__v": 0,
    "links": {
        "self": {
            "href": "http://localhost:3000/api/v1/courses/2016/1/NRC/10760"
        },
        "course": {
            "href": "http://localhost:3000/api/v1/courses/2016/1/IIC2233"
        },
        "requirements": {
            "href": "http://localhost:3000/api/v1/courses/2016/1/IIC2233/requirements"
        },
        "equivalences": {
            "href": "http://localhost:3000/api/v1/courses/2016/1/IIC2233/equivalences"
        }
    }
}
                    `
                ))]);
            }
            return this.schedules[ID];
        });
    }

    loadAll(): Promise<Schedule[]> {
        return this.loadNames().then(names => {
            return Promise.all(names.map(name => this.loadSchedule(name)));
        });
    }
}
