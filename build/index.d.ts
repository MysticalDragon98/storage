interface StorageOptions {
    dir: string;
}
export declare class Storage {
    private options;
    private _streams;
    json: any;
    env: any;
    constructor(options: StorageOptions);
    init(): Promise<void>;
    path(path: string): string;
    write(name: string, data: any): Promise<void>;
    writeSync(name: string, data: any): void;
    read(name: string, defaultValue?: any): Promise<any>;
    readSync(name: string, defaultValue?: any): any;
    mkdir(path: string): Promise<void>;
    stream(path: string): any;
}
export {};
