/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import {
    QueryOptions,
    QueryResult,
    ScalarOptions,
    BpmsBaseMemoryRepository,
    FilterExpression,
} from '../data/Repository';

export interface UIServiceOptions {
    name: string;
}

export interface ProcessViewData {
    definitionName: string;
    view: BpmsProcessView;
}
export interface BpmsProcessView {
    definitionName: string;
    processName: string;
    processId: string;
    definitionId: string;
    id: string;
    type: string;
    key: string;
    icon: string;
    target: string;
    title: string;
    enabled: string;
    order: string;
    category: string;
    tags: string;
    author: string;
    authorization: string;
    body: string;
}

export class UIService<T extends ProcessViewData = ProcessViewData> {
    private viewRepository: BpmsBaseMemoryRepository<T>;
    private id: string = uuidv1();
    private options: UIServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: UIServiceOptions) {
        this.options = options || { name: 'UIService' + this.id };
        this.viewRepository = new BpmsBaseMemoryRepository({
            storageName: 'View',
            keyPropertyname: 'id',
            properties: {},
        });
    }

    public static createService(options?: UIServiceOptions): UIService;
    public static createService(bpmsEngine?: BpmsEngine, options?: UIServiceOptions): UIService;
    public static createService(arg1?: BpmsEngine | UIServiceOptions, arg2?: UIServiceOptions): UIService {
        if (arg1 instanceof BpmsEngine) {
            return new UIService(arg1, arg2);
        }
        return new UIService(undefined, arg1);
    }

    public get Id(): string {
        return this.id;
    }

    public get Name(): string {
        return this.options.name;
    }
    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }

    public async clear(): Promise<void> {
        return this.viewRepository.clear();
    }

    public async create(definitionName: string, view: any): Promise<T> {
        const d = { definitionName, view };
        return this.viewRepository.create(d);
    }
    public async findView(processName: string, viewName: string): Promise<T | null> {
        return this.viewRepository.find({ processName, viewName });
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.viewRepository.delete(entityId);
    }

    public async find(entityId: string): Promise<T | null> {
        return this.viewRepository.find(entityId);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.viewRepository.findAll(filter);
    }
    public async count(filter: FilterExpression): Promise<number> {
        return this.viewRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.viewRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.viewRepository.scalar(options);
    }
}
