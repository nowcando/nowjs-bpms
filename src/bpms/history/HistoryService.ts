/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { TaskRepository } from '../task/TaskRepository';
import { BpmsHistoryModel, HistoryMemoryRepository, HistoryRepository } from './HistoryRepository';
import { QueryOptions, QueryResult, ScalarOptions, IdExpression, FilterExpression } from '../data/Repository';
import { BpmsService } from '../BpmsService';

export interface HistoryServiceOptions {
    historyRepository?: HistoryRepository;
    name: string;
}

export interface BpmsHistoryEntry {
    id?: string;
    createdAt?: string;
    source?: string;
    tenantId: string;
    userId: string;

    type?: string;
}
export class HistoryService<T extends BpmsHistoryEntry = BpmsHistoryEntry> implements BpmsService {
    private historyRepository: HistoryRepository<T>;
    private id: string = uuidv1();
    private options: HistoryServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: HistoryServiceOptions) {
        this.options = options || { name: 'HistoryService' + this.id };
        this.historyRepository = this.options.historyRepository || (new HistoryMemoryRepository() as any);
    }

    public static createService(options?: HistoryServiceOptions): HistoryService;
    public static createService(bpmsEngine?: BpmsEngine, options?: HistoryServiceOptions): HistoryService;
    public static createService(
        arg1?: BpmsEngine | HistoryServiceOptions,
        arg2?: HistoryServiceOptions,
    ): HistoryService {
        if (arg1 instanceof BpmsEngine) {
            return new HistoryService(arg1, arg2);
        }
        return new HistoryService(undefined, arg1);
    }
    public get HistoryRepository(): HistoryRepository<T> {
        return this.historyRepository;
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
    public async create(entity: T): Promise<T> {
        return this.historyRepository.create(entity);
    }

    public async remove(id: IdExpression): Promise<boolean> {
        return this.historyRepository.delete(id);
    }

    public async find(id: IdExpression): Promise<T | null>;
    public async find(filter: FilterExpression): Promise<T | null>;
    public async find(expression: IdExpression | FilterExpression): Promise<T | null> {
       return this.historyRepository.find(expression);
    }
    public async findAll(filter?: FilterExpression): Promise<T[]> {
        return this.historyRepository.findAll(filter);
    }

    public async clear(): Promise<void> {
        return this.historyRepository.clear();
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.historyRepository.findAll(filter);
    }
    public async count(filter?: FilterExpression): Promise<number> {
        return this.historyRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.historyRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.historyRepository.scalar(options);
    }
}
