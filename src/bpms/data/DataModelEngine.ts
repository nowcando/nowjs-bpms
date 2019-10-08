import { JsonSchemaDefinition, uuidv1 } from "nowjs-core/lib/utils";
import {ValidationDefinition} from "nowjs-core/lib/validation";
import { BpmsEngine } from "../BpmsEngine";
import {
  DataModelMemoryPersistent,
  DataModelPersistency,
} from "./DataModelPersistency";

export interface DataModelEngineOptions {
  name: string;
  datamodelPersistency?: DataModelPersistency;
}
export interface DataModelSchema extends JsonSchemaDefinition {}
export interface DataModelRelation {

    type: "0..1" | "1..1" | "1..*" | "*..*";
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
export class DataModelEngine {
  private dataModelCache: { [name: string]: any } = {};
  private id: string = uuidv1();
  private name: string;
  private datamodelPersistency: DataModelPersistency;
  private options: DataModelEngineOptions;
  private bpmsEngine: BpmsEngine | undefined;

  constructor(options?: DataModelEngineOptions);
  constructor(bpmsEngine?: BpmsEngine, options?: DataModelEngineOptions);
  constructor(
    arg1?: BpmsEngine | DataModelEngineOptions,
    arg2?: DataModelEngineOptions,
  ) {
    if (arg1 instanceof BpmsEngine) {
      this.bpmsEngine = arg1;
      this.options = arg2 || { name: "DataModelEngine-" + this.id };
      this.name = this.options.name;
    } else {
      this.bpmsEngine = undefined;
      this.options = arg1 || { name: "DataModelEngine-" + this.id };
      this.name = this.options.name;
    }

    this.datamodelPersistency =
      this.options.datamodelPersistency || new DataModelMemoryPersistent();
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

  public get DataModelPersistency(): DataModelPersistency {
    return this.datamodelPersistency;
  }

  public static createEngine(options?: DataModelEngineOptions): DataModelEngine;
  public static createEngine(
    bpmsEngine?: BpmsEngine,
    options?: DataModelEngineOptions,
  ): DataModelEngine;
  public static createEngine(
    arg1?: BpmsEngine | DataModelEngineOptions,
    arg2?: DataModelEngineOptions,
  ): DataModelEngine {
    if (arg1 instanceof BpmsEngine) {
      return new DataModelEngine(arg1, arg2);
    }
    return new DataModelEngine(undefined, arg1);
  }

  public async registerDataModel(
    name: string,
    definition: DataModelDefinition,
  ): Promise<boolean> {
    this.datamodelPersistency.persist({ definitions: definition, name });
    return Promise.resolve(true);
  }


}
