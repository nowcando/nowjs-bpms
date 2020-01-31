/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { DataSourceMemoryRepository, DataSourceRepository } from './DataSourceRepository';
import { QueryOptions, QueryResult, ScalarOptions, FilterExpression } from './Repository';

export interface DataSourceServiceOptions {
    name: string;
    datasourceRepository?: DataSourceRepository;
}
export interface DataSourceSchema<T> {
    name: string;

    find(fn: (item: T, index: number) => boolean): Promise<T[]>;
    list(): Promise<T[]>;
    create(data: T): Promise<T>;
    remove(data: T | string | number): Promise<boolean>;
    count(): Promise<number>;
}
export type DataSourceObjectSchema = DataSourceSchema<Record<string, any>>;
export interface DataSourceWebApiSchema<T> extends DataSourceSchema<T> {
    url?: string;
    params?: any;
    method?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
}
export interface DataSourceRestApiSchema<T> extends DataSourceSchema<T> {
    url?: string;
    params?: any;
}

export interface DataSourceDefinition {
    sources: Array<DataSourceSchema<any>>;
}

export interface BpmsDataSource {
    id: string;
    name: string;
    definition: DataSourceDefinition;
    createdAt?: Date;
}
export class DataSourceService<T extends BpmsDataSource = BpmsDataSource> {
    private datasourceCache: { [name: string]: any } = {};
    private id: string = uuidv1();
    private name: string;
    private datasourceRepository: DataSourceRepository;
    private options: DataSourceServiceOptions;
    private bpmsEngine: BpmsEngine | undefined;

    constructor(options?: DataSourceServiceOptions);
    constructor(bpmsEngine?: BpmsEngine, options?: DataSourceServiceOptions);
    constructor(arg1?: BpmsEngine | DataSourceServiceOptions, arg2?: DataSourceServiceOptions) {
        if (arg1 instanceof BpmsEngine) {
            this.bpmsEngine = arg1;
            this.options = arg2 || { name: 'DataSourceEngine-' + this.id };
            this.name = this.options.name;
        } else {
            this.bpmsEngine = undefined;
            this.options = arg1 || { name: 'DataSourceEngine-' + this.id };
            this.name = this.options.name;
        }

        this.datasourceRepository = this.options.datasourceRepository || new DataSourceMemoryRepository();
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

    public get DataSourcePersistency(): DataSourceRepository {
        return this.datasourceRepository;
    }

    public static createEngine(options?: DataSourceServiceOptions): DataSourceService;
    public static createEngine(bpmsEngine?: BpmsEngine, options?: DataSourceServiceOptions): DataSourceService;
    public static createEngine(
        arg1?: BpmsEngine | DataSourceServiceOptions,
        arg2?: DataSourceServiceOptions,
    ): DataSourceService {
        if (arg1 instanceof BpmsEngine) {
            return new DataSourceService(arg1, arg2);
        }
        return new DataSourceService(undefined, arg1);
    }

    // public async create(name: string, definition: DataSourceDefinition): Promise<boolean> {
    //     this.datasourceRepository.create({ definitions: definition, name });
    //     return Promise.resolve(true);
    // }

    public async create(dataSource: T): Promise<T> {
        return this.datasourceRepository.create(dataSource);
    }
    public async remove(dataSourceId: string): Promise<boolean> {
        return this.datasourceRepository.delete(dataSourceId);
    }

    public async clear(): Promise<void> {
        return this.datasourceRepository.clear();
    }

    public async find(dataSourceId: string): Promise<T | null> {
        return this.datasourceRepository.find(dataSourceId);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.datasourceRepository.findAll(filter);
    }
    public async count(filter?: FilterExpression): Promise<number> {
        return this.datasourceRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.datasourceRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.datasourceRepository.scalar(options);
    }
}
