/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonSchemaDefinition, uuidv1 } from 'nowjs-core/lib/utils';
import { ValidationDefinition } from 'nowjs-core/lib/validation';
import { BpmsEngine } from '../BpmsEngine';
import { DataModelMemoryRepository, DataModelRepository } from './DataModelRepository';
import { QueryOptions, QueryResult, ScalarOptions, FilterExpression } from './Repository';
import { BpmsService } from '../BpmsService';

export interface DataModelServiceOptions {
    name: string;
    datamodelPersistency?: DataModelRepository;
}
// tslint:disable-next-line:no-empty-interface
export type DataModelSchema = JsonSchemaDefinition;
export interface DataModelRelation {
    type: '0..1' | '1..1' | '1..*' | '*..*';
    sourceKey?: string;
    targetKey?: string;
}
export interface DataModelSchemaDefinition {
    [name: string]: DataModelSchema;
}
export interface DataModelRelationDefinition {
    [name: string]: DataModelRelation;
}
export interface DataModelDefinition {
    models: DataModelSchemaDefinition;
    relations?: DataModelRelationDefinition;
}

export interface BpmsDataModel {
    id?: string;
    name: string;
    definition: DataModelDefinition;
    createdAt?: string;
}

export class DataModelService<T extends BpmsDataModel = BpmsDataModel> implements BpmsService {
    private dataModelCache: { [name: string]: any } = {};
    private id: string = uuidv1();
    private name: string;
    private datamodelRepository: DataModelRepository;
    private options: DataModelServiceOptions;
    private bpmsEngine: BpmsEngine | undefined;

    constructor(options?: DataModelServiceOptions);
    constructor(bpmsEngine?: BpmsEngine, options?: DataModelServiceOptions);
    constructor(arg1?: BpmsEngine | DataModelServiceOptions, arg2?: DataModelServiceOptions) {
        if (arg1 instanceof BpmsEngine) {
            this.bpmsEngine = arg1;
            this.options = arg2 || { name: 'DataModelEngine-' + this.id };
            this.name = this.options.name;
        } else {
            this.bpmsEngine = undefined;
            this.options = arg1 || { name: 'DataModelEngine-' + this.id };
            this.name = this.options.name;
        }

        this.datamodelRepository = this.options.datamodelPersistency || new DataModelMemoryRepository();
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

    public static createEngine(options?: DataModelServiceOptions): DataModelService;
    public static createEngine(bpmsEngine?: BpmsEngine, options?: DataModelServiceOptions): DataModelService;
    public static createEngine(
        arg1?: BpmsEngine | DataModelServiceOptions,
        arg2?: DataModelServiceOptions,
    ): DataModelService {
        if (arg1 instanceof BpmsEngine) {
            return new DataModelService(arg1, arg2);
        }
        return new DataModelService(undefined, arg1);
    }

    public async create(dataModel: T): Promise<T> {
        return this.datamodelRepository.create(dataModel);
    }
    public async remove(dataModelId: string): Promise<boolean> {
        return this.datamodelRepository.delete(dataModelId);
    }

    public async clear(): Promise<void> {
        return this.datamodelRepository.clear();
    }

    public async find(dataModelId: string): Promise<T | null> {
        return this.datamodelRepository.find(dataModelId);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.datamodelRepository.findAll(filter);
    }
    public async count(filter?: FilterExpression): Promise<number> {
        return this.datamodelRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.datamodelRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.datamodelRepository.scalar(options);
    }
}
