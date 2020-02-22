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
import { UIMemoryRepository, UIRepository } from './UIRepository';

export interface UIServiceOptions {
    name: string;
    uiRepository?: UIRepository;
}

export interface BpmsDynamicViewModel {
    definitionId?: string;
    definitionName?: string;
    definitionVersion?: number;
    processId: string;
    processName: string;
    activityName: string;
    activityType: string;
    activityId: string;
    id?: string;
    name: string;
    title: string;

    descriptions?: string;
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
export interface BpmsUI {
    definitionId?: string;
    definitionName?: string;
    definitionVersion?: number;
    systemId?: string;
    systemName?: string;
    descriptions?: string;
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

export class UIService<T extends BpmsUI = BpmsUI> implements BpmsService {
    private uiRepository: UIRepository;
    private id: string = uuidv1();
    private options: UIServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: UIServiceOptions) {
        this.options = options || { name: 'UIService' + this.id };
        this.uiRepository = this.options.uiRepository || new UIMemoryRepository();
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
        return this.uiRepository.clear();
    }

    public async create(view: BpmsUI): Promise<T> {
        const v = await this.uiRepository.find({ name: view.name, definitionId: view.definitionId });
        if (v) {
            throw new Error(`The view '${view.name}' already exists`);
        }
        const r = await this.uiRepository.create(view);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The view has been created`,
            data: {
                viewId: r.id,
                viewName: r.name,
                activityId: r.activityId,
                definitionId: r.definitionId,
                definitionVersion: r.definitionVersion,
                processId: r.processId,
            },
            eventId: 100143,
        });
        return r as any;
    }
    public async findView(processName: string, viewName: string): Promise<T | null> {
        return this.uiRepository.find({ processName, viewName });
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.uiRepository.delete(entityId);
    }

    public async find(filter: FilterExpression): Promise<T | null>;
    public async find(entityId: string): Promise<T | null>;
    public async find(expression: FilterExpression | string): Promise<T | null> {
        return this.uiRepository.find(expression);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.uiRepository.findAll(filter);
    }
    public async count(filter?: FilterExpression): Promise<number> {
        return this.uiRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.uiRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.uiRepository.scalar(options);
    }
}
