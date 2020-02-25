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
import { SystemMemoryRepository, SystemRepository } from './SystemRepository';

export interface SystemServiceOptions {
    systemRepository?: SystemRepository;
    name: string;
}

export interface BpmsSystem {
    id?: string;
    key?: string;
    icon: string;
    class: string;
    target: string;
    title: string;
    enabled?: boolean;
    name: string;
    displayOrder?: string;
    category?: string;
    tags?: string;
}

export class SystemService<T extends BpmsSystem = BpmsSystem> implements BpmsService {
    private systemRepository!: SystemRepository;
    private id: string = uuidv1();
    private options: SystemServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: SystemServiceOptions) {
        this.options = options || { name: 'SystemService' + this.id };
        this.systemRepository =
            this.options.systemRepository ||
            new BpmsBaseMemoryRepository({
                storageName: 'BpmsSystem',
                keyPropertyname: 'id',
                properties: {
                    id: { type: 'string', default: () => uuidv1() },
                },
            });
    }

    public static createService(options?: SystemServiceOptions): SystemService;
    public static createService(bpmsEngine?: BpmsEngine, options?: SystemServiceOptions): SystemService;
    public static createService(arg1?: BpmsEngine | SystemServiceOptions, arg2?: SystemServiceOptions): SystemService {
        if (arg1 instanceof BpmsEngine) {
            return new SystemService(arg1, arg2);
        }
        return new SystemService(undefined, arg1);
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
        return this.systemRepository.clear();
    }

    public async create(entity: T): Promise<T> {
        return this.systemRepository.create(entity);
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.systemRepository.delete(entityId);
    }

    public async find(entityId: IdExpression): Promise<T | null>;
    public async find(filter: FilterExpression): Promise<T | null>;
    public async find(expression: string): Promise<T | null> {
        return this.systemRepository.find(expression);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.systemRepository.findAll(filter);
    }
    public async count(filter: FilterExpression): Promise<number> {
        return this.systemRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.systemRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.systemRepository.scalar(options);
    }
}
