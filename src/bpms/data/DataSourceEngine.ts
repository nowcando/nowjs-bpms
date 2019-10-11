import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "../BpmsEngine";
import {
  DataSourceMemoryPersistent,
  DataSourcePersistency,
} from "./DataSourcePersistency";

export interface DataSourceEngineOptions {
  name: string;
  datasourcePersistency?: DataSourcePersistency;
}
export interface DataSourceSchema<T>  {
  name: string;

  find(fn: (item: T, index: number ) => boolean): Promise<T[]>;
  list(): Promise<T[]>;
  create(data: T): Promise<T>;
  remove(data: T|string|number): Promise<boolean>;
  count(): Promise<number>;
}
export interface DataSourceObjectSchema<T> extends DataSourceSchema<T> {
}
export interface DataSourceWebApiSchema<T> extends DataSourceSchema<T> {
  url?: string;
  params?: any;
  method?: "POST"|"GET"|"PUT"|"PATCH"|"DELETE"|"OPTIONS";
}
export interface DataSourceRestApiSchema<T> extends DataSourceSchema<T> {
  url?: string;
  params?: any;
}

export interface DataSourceDefinition {
    sources: Array<DataSourceSchema<any>>;
}
export class DataSourceEngine {
  private datasourceCache: { [name: string]: any } = {};
  private id: string = uuidv1();
  private name: string;
  private datasourcePersistency: DataSourcePersistency;
  private options: DataSourceEngineOptions;
  private bpmsEngine: BpmsEngine | undefined;

  constructor(options?: DataSourceEngineOptions);
  constructor(bpmsEngine?: BpmsEngine, options?: DataSourceEngineOptions);
  constructor(
    arg1?: BpmsEngine | DataSourceEngineOptions,
    arg2?: DataSourceEngineOptions,
  ) {
    if (arg1 instanceof BpmsEngine) {
      this.bpmsEngine = arg1;
      this.options = arg2 || { name: "DataSourceEngine-" + this.id };
      this.name = this.options.name;
    } else {
      this.bpmsEngine = undefined;
      this.options = arg1 || { name: "DataSourceEngine-" + this.id };
      this.name = this.options.name;
    }

    this.datasourcePersistency =
      this.options.datasourcePersistency || new DataSourceMemoryPersistent();
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

  public get DataSourcePersistency(): DataSourcePersistency {
    return this.datasourcePersistency;
  }

  public static createEngine(options?: DataSourceEngineOptions): DataSourceEngine;
  public static createEngine(
    bpmsEngine?: BpmsEngine,
    options?: DataSourceEngineOptions,
  ): DataSourceEngine;
  public static createEngine(
    arg1?: BpmsEngine | DataSourceEngineOptions,
    arg2?: DataSourceEngineOptions,
  ): DataSourceEngine {
    if (arg1 instanceof BpmsEngine) {
      return new DataSourceEngine(arg1, arg2);
    }
    return new DataSourceEngine(undefined, arg1);
  }

  public async registerDataSource(
    name: string,
    definition: DataSourceDefinition,
  ): Promise<boolean> {
    this.datasourcePersistency.persist({ definitions: definition, name });
    return Promise.resolve(true);
  }


}
