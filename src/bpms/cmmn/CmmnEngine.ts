import { uuidv1 } from 'nowjs-core/lib/utils/UuidUtils';
import { BpmsEngine } from '../BpmsEngine';

export interface CmmnEngineOptions {
    name: string;
}

export class CmmnEngine {
    private definitionCache: { [name: string]: any } = {};
    private id: string = uuidv1();
    private name: string;
    private options: CmmnEngineOptions;

    public static createEngine(options?: CmmnEngineOptions): CmmnEngine;
    public static createEngine(bpmsEngine: BpmsEngine, options?: CmmnEngineOptions): CmmnEngine;
    public static createEngine(arg1?: BpmsEngine | CmmnEngineOptions, arg2?: CmmnEngineOptions): CmmnEngine {
        if (arg1 instanceof BpmsEngine) {
            return new CmmnEngine(arg1, arg2);
        }
        return new CmmnEngine(undefined, arg1);
    }
    constructor(private bpmsEngine?: BpmsEngine, options?: CmmnEngineOptions) {
        this.options = options || { name: 'CmmnEngine-' + this.id };
        this.name = this.options.name;
    }
    public get Id(): string {
        return this.id;
    }

    public get Name(): string {
        return this.name;
    }
    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }
}
