/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
import { BpmsService } from '../BpmsService';

export interface UIServiceOptions {
    name: string;
}

export interface BpmsDynamicViewModel {
    processDefinitionId?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    processId: string;
    processName: string;
    activityName: string;
    activityType: string;
    activityId: string;
    id?: string;
    name: string;
    title: string;
    type: string;
    target: string;
    renderEngine: string;
    renderEngineVersion: string;
    default: boolean;
    enabled: string;
    category: string;
    tags: string;
    displayOrder: string;
    icon: string;
    class: string;
    script: { resource?: string; format?: string; content: string };
    template: { resource?: string; format?: string; content: string };
    style: { resource?: string; format?: string; content: string };
    authorization: string;
    author: string;
    createdAt?: Date;
}
export interface BpmsDynamicView {
    processDefinitionId?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    processId: string;
    processName: string;
    activityName: string;
    activityType: string;
    activityId: string;
    id?: string;
    name: string;
    title: string;
    type: string;
    target: string;
    renderEngine: string;
    renderEngineVersion: string;
    default: boolean;
    enabled: string;
    category: string;
    tags: string;
    displayOrder: string;
    icon: string;
    class: string;
    script: { resource?: string; format?: string; content: string };
    template: { resource?: string; format?: string; content: string };
    style: { resource?: string; format?: string; content: string };
    authorization: string;
    author: string;
    createdAt?: Date;
    actions: { name: string; description: string; value: any }[];
}

export class UIService<T extends BpmsDynamicView = BpmsDynamicView> implements BpmsService {
    private viewRepository: BpmsBaseMemoryRepository<T>;
    private id: string = uuidv1();
    private options: UIServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: UIServiceOptions) {
        this.options = options || { name: 'UIService' + this.id };
        this.viewRepository = new BpmsBaseMemoryRepository({
            storageName: 'BpmsView',
            keyPropertyname: 'id',
            properties: {
                id: { type: 'string', default: () => uuidv1() },
            },
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

    public async create(view: BpmsDynamicView): Promise<T> {
        const v = await this.viewRepository.find({ name: view.name, definitionId: view.processDefinitionId });
        if (v) {
            throw new Error(`The view '${view.name}' already exists`);
        }
        return this.viewRepository.create(view);
    }
    public async findView(processName: string, viewName: string): Promise<T | null> {
        return this.viewRepository.find({ processName, viewName });
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.viewRepository.delete(entityId);
    }

    public async find(filter: FilterExpression): Promise<T | null>;
    public async find(entityId: string): Promise<T | null>;
    public async find(expression: FilterExpression | string): Promise<T | null> {
        return this.viewRepository.find(expression);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.viewRepository.findAll(filter);
    }
    public async count(filter?: FilterExpression): Promise<number> {
        return this.viewRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.viewRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.viewRepository.scalar(options);
    }
}
