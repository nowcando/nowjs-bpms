/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'nowjs-core';
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import {
    QueryOptions,
    QueryResult,
    ScalarOptions,
    BpmsBaseMemoryRepository,
    FilterExpression,
    IdExpression,
} from '../data/Repository';
import { BpmsService } from '../BpmsService';
import { RouterRepository } from './RouterRepository';

export interface RouterServiceOptions {
    routerRepository?: RouterRepository;
    name: string;
}

export interface BpmsRoute {
    systemId?: string;
    systemName?: string;
    definitionId?: string;
    definitionName?: string;
    definitionVersion?: number;
    processName?: string;
    processId?: string;
    id?: string;
    type?: 'static' | 'dynamic';
    key?: string;
    icon?: string;
    class?: string;
    target?: string;
    title?: string;
    enabled?: boolean;
    name: string;
    displayOrder?: string;
    category?: string;
    tags?: string[];
    authorization?: string;
    author?: string;
    route: string;
    variables?: Record<string, any>;
}

export class RouterService<T extends BpmsRoute = BpmsRoute> implements BpmsService {
    private routerRepository!: RouterRepository;
    private id: string = uuidv1();
    private options: RouterServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: RouterServiceOptions) {
        this.options = options || { name: 'RouterService' + this.id };
        this.routerRepository =
            this.options.routerRepository ||
            new BpmsBaseMemoryRepository({
                storageName: 'BpmsRouter',
                keyPropertyname: 'id',
                properties: {
                    id: { type: 'string', default: () => uuidv1() },
                },
            });
    }

    public static createService(options?: RouterServiceOptions): RouterService;
    public static createService(bpmsEngine?: BpmsEngine, options?: RouterServiceOptions): RouterService;
    public static createService(arg1?: BpmsEngine | RouterServiceOptions, arg2?: RouterServiceOptions): RouterService {
        if (arg1 instanceof BpmsEngine) {
            return new RouterService(arg1, arg2);
        }
        return new RouterService(undefined, arg1);
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
        return this.routerRepository.clear();
    }

    public async create(entity: T): Promise<T> {
        return this.routerRepository.create(entity);
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.routerRepository.delete(entityId);
    }

    public async find(entityId: IdExpression): Promise<T | null>;
    public async find(filter: FilterExpression): Promise<T | null>;
    public async find(expression: string): Promise<T | null> {
        return this.routerRepository.find(expression);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.routerRepository.findAll(filter);
    }
    public async getRouteList<R = T>(filter?: FilterExpression): Promise<R[]> {
        const l = this.routerRepository.query({ filter, sortBy: { route: 'asc' } });
        return this.routerRepository.findAll(filter);
    }
    public async count(filter: FilterExpression): Promise<number> {
        return this.routerRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.routerRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.routerRepository.scalar(options);
    }
}
