import { Storage } from "./index";
export declare class JSONStorage<T> {
    private storage;
    path: string;
    private _cache;
    private _initialized;
    private _isSaving;
    private _isQueued;
    constructor(storage: Storage, path: string);
    get proxy(): any;
    init(): void;
    get(props: string[]): any;
    set(props: string[], val: any): void;
    save(): Promise<void>;
}
