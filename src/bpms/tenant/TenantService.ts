/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { TenantMemoryRepository, TenantRepository } from './TenantRepository';
import { QueryOptions, QueryResult, ScalarOptions, FilterExpression } from '../data/Repository';

export interface Tenant {
    id: string;
    name: string;
}

export interface TenantServiceOptions {
    tenantRepository?: TenantRepository;
    name: string;
}
export class TenantService<T extends Tenant = Tenant> {
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
    public async create(task: T): Promise<T> {
        return this.tenantRepository.create(task);
    }
    public async remove(taskId: string): Promise<boolean> {
        return this.tenantRepository.delete(taskId);
    }

    public async find(taskId: string): Promise<T | null> {
        return this.tenantRepository.find(taskId);
    }
    public async findAll<R = T>(filter: FilterExpression): Promise<R[]> {
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
