/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { TenantMemoryRepository, TenantRepository } from './TenantRepository';
import { QueryOptions, QueryResult, ScalarOptions, FilterExpression } from '../data/Repository';
import { BpmsService } from '../BpmsService';

export interface BpmsTenant {
    id: string;
    name: string;
}

export interface TenantServiceOptions {
    tenantRepository?: TenantRepository;
    name: string;
}
export class TenantService<T extends BpmsTenant = BpmsTenant> implements BpmsService {
    private tenantRepository: TenantRepository<T>;
    private id: string = uuidv1();
    private options: TenantServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: TenantServiceOptions) {
        this.options = options || { name: 'TenantService' + this.id };
        this.tenantRepository = this.options.tenantRepository || new TenantMemoryRepository();
    }

    public static createService(options?: TenantServiceOptions): TenantService;
    public static createService(bpmsEngine?: BpmsEngine, options?: TenantServiceOptions): TenantService;
    public static createService(arg1?: BpmsEngine | TenantServiceOptions, arg2?: TenantServiceOptions): TenantService {
        if (arg1 instanceof BpmsEngine) {
            return new TenantService(arg1, arg2);
        }
        return new TenantService(undefined, arg1);
    }

    public get Id(): string {
        return this.id;
    }

    public get Name(): string {
        return this.options.name;
    }
    public get TenantRepository(): TenantRepository<T> {
        return this.tenantRepository;
    }
    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }
    public async clear(): Promise<void> {
        return this.tenantRepository.clear();
    }
    public async create(entity: T): Promise<T> {
        return this.tenantRepository.create(entity);
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.tenantRepository.delete(entityId);
    }

    public async find(entityId: string): Promise<T | null> {
        return this.tenantRepository.find(entityId);
    }
    public async list<R = T>(filter: FilterExpression): Promise<R[]> {
        return this.tenantRepository.findAll(filter);
    }
    public async count(filter: FilterExpression): Promise<number> {
        return this.tenantRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.tenantRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.tenantRepository.scalar(options);
    }
}
