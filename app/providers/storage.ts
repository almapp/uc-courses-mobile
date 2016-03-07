import {Storage, SqlStorage, LocalStorage} from "ionic-angular";
import {Injectable} from "angular2/core";
const PouchDB = require("pouchdb");


export default class StorageProvider {
    protected db: any;
    protected cache: Storage;

    public setup(name = "database", opts: { searchable?: boolean } = {}) {
        // See: http://pouchdb.com/api.html
        console.log(`Starting database ${name}`);

        this.cache = new Storage(LocalStorage);
        if (opts.searchable) {
            PouchDB.plugin(require("pouchdb-quick-search"));
        }
        return this.db = new PouchDB(name, { adapter : "websql" });
    }

    public info(): Promise<any> {
        return this.db.info();
    }
}
