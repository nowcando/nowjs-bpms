import { uuidv1 } from "nowjs-core/lib/utils/UuidUtils";
import { BpmnEngine, BpmnEngineOptions } from "./bpmn";
import { CmmnEngine, CmmnEngineOptions } from "./cmmn";
import { DmnEngine, DmnEngineOptions } from "./dmn";

export interface BpmsEngineOptions {
  name: string;
  cache?: boolean;
  bpmnEngine?: BpmnEngineOptions;
  dmnEngine?: DmnEngineOptions;
  cmmnEngine?: CmmnEngineOptions;
}
export class BpmsEngine {
  private static cache: { [name: string]: BpmsEngine } = {};
  private bpmnEngine: BpmnEngine;
  private dmnEngine: DmnEngine;
  private cmmnEngine: CmmnEngine;

  private id: string = uuidv1();
  private name: string;
  private options: BpmsEngineOptions;
  constructor(options?: BpmsEngineOptions) {
    this.options = options || { name: "BpmsEngine-" + this.id };
    this.options.cache = this.options.cache ? this.options.cache : true;
    this.name = this.options.name;
    if (this.options.cache) {
      if (!BpmsEngine.cache[this.name]) {
        BpmsEngine.cache[this.name] = this;
      } else {
        throw new Error(
          `The BpmsEngine with current name '${this.name}' already exist in cache`,
        );
      }
    }
    this.bpmnEngine = BpmnEngine.createEngine(this.options.bpmnEngine);
    this.dmnEngine = DmnEngine.createEngine(this.options.bpmnEngine);
    this.cmmnEngine = CmmnEngine.createEngine(this.options.cmmnEngine);
  }

  public static createEngine(options?: BpmsEngineOptions): BpmsEngine {
    const eng = new BpmsEngine(options);
    return eng;
  }

  public static listCache(): BpmsEngine[] {
    return Object.entries(BpmsEngine.cache).map((xx) => xx[1]);
  }
  public static resetCache(): void {
    BpmsEngine.cache = {};
  }

  public get Id(): string {
    return this.id;
  }

  public get Name(): string {
    return this.name;
  }
  public get BpmnEngine(): BpmnEngine {
    return this.bpmnEngine;
  }
  public get DmnEngine(): DmnEngine {
    return this.dmnEngine;
  }

  public get CmmnEngine(): CmmnEngine {
    return this.cmmnEngine;
  }
}
