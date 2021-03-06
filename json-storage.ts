import { Storage } from "./index";
import { ElasticProxy } from "@mysticaldragon/proxies";

export class JSONStorage<T> {

    private _cache: any;
    private _initialized: boolean = false;
    private _isSaving: boolean = false;
    private _isQueued: boolean = false;

    constructor (private storage: Storage, public path: string) {
        
    }

    get proxy () {
        return ElasticProxy.new({
            recursive: false,

            get: (prop: string): T => {
                return this.get([prop])
            },

            set: (prop: string, val: T) => {
                return this.set([prop], val);
            }

        })
    }

    init () {
        if (this._initialized) return;

        const fileData = this.storage.readSync(this.path, {});
        this._cache = fileData instanceof Buffer? JSON.parse(fileData.toString()) : {};
        this._initialized = true;
    }

    get (props: string[]) {
        this.init();

        let ptr = this._cache;

        for (const prop of props) {
            ptr = ptr[prop];

            if (ptr === undefined) return undefined;
        }

        return ptr;
    }

    set (props: string[], val: any) {
        this.init();
        
        let ptr = this._cache;

        for (let i=0; i < props.length - 1;i++) {
            let temp_ptr = ptr;
            ptr = ptr[props[i]];

            if (ptr === undefined) ptr = temp_ptr[props[i]] = {};
        }
        
        ptr[props[props.length - 1]] = val;

        this.save();
    }

    async save () {
        if (this._isSaving) {
            this._isQueued = true;
            return;
        }

        this._isSaving = true;
        await this.storage.write(this.path, this._cache);
        this._isSaving = false;

        if(this._isQueued) {
            this._isQueued = false;
            this.save();
        }
    }

}
