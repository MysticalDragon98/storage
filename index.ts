const fs = require("fs/promises");
const { createWriteStream, readFileSync, writeFileSync } = require('fs');
import { JSONStorage } from "./json-storage";
import { ElasticProxy } from "@mysticaldragon/proxies";
import { resolve } from "path";
import { join } from "path";

interface StorageOptions {
    dir: string;
}

export class Storage {
    
    private _streams: { [key: string]: WritableStream } = {};
    public json: any;
    public env: any;

    constructor (private options: StorageOptions) {

    }
    
    async init () {
        await this.mkdir(this.options.dir);
        await this.mkdir(join(this.options.dir, "json"));

        this.json = ElasticProxy.new({
            recursive: false,

            get: (path)  => {
                return new JSONStorage(this, this.path("/json/" + path + ".json")).proxy;
            }
        });

        this.env = this.json.env.proxy;
    }

    path (path: string) {
        return resolve(this.options.dir, path);
    }

    async write (name: string, data: any) {
        await fs.writeFile(this.path(name), JSON.stringify(data));
    }

    writeSync (name: string, data: any) {
        writeFileSync(this.path(name), JSON.stringify(data));
    }

    async read (name: string, defaultValue?: any) {
        try {
            return await fs.readFile(this.path(name));
        } catch (exc: any) {
            if (exc.code === "ENOENT" && defaultValue) {
                await this.write(name, defaultValue);
                return defaultValue;
            }
            throw exc;
        }
    }

    readSync (name: string, defaultValue?: any) {
        try {
            return readFileSync(this.path(name));
        } catch (exc: any) {
            if (exc.code === "ENOENT" && defaultValue) {
                this.writeSync(name, defaultValue);
                return defaultValue;
            }
            throw exc;
        }
    }
    
    async mkdir (path: string) {
        try {
            await fs.mkdir(this.path(path))
        } catch (exc: any) {
            if (exc.code !== 'EEXIST') throw exc;
        }
    }

    stream (path: string) {
        const file = this._streams[path];

        if (file) return file;

        return this._streams[path] = createWriteStream(this.path(path), {
            flags: 'a+'
        })
    }
}
