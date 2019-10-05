import { uuidv1 } from "nowjs-core/lib/utils/UuidUtils";
import { BpmsEngine } from "../BpmsEngine";

export interface CmmnEngineOptions {
  name: string;
}

export class CmmnEngine {
  private definitionCache: { [name: string]: any } = {};
  private id: string = uuidv1();
  private name: string;
  private options: CmmnEngineOptions;
  public static createEngine(bpmsEngine: BpmsEngine, options?: CmmnEngineOptions): CmmnEngine {
    return new CmmnEngine(bpmsEngine, options);
  }
  constructor(private bpmsEngine?: BpmsEngine, options?: CmmnEngineOptions) {
    this.options = options || { name: "CmmnEngine-" + this.id };
    this.name = this.options.name;
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
}
