import { uuidv1 } from "nowjs-core/lib/utils/UuidUtils";
import { BpmnEngine, BpmnEngineOptions } from "./bpmn";
import { CmmnEngine, CmmnEngineOptions } from "./cmmn";
import { DataModelEngine, DataModelEngineOptions, DataSourceEngine } from "./data";
import { DmnEngine, DmnEngineOptions } from "./dmn";

export interface BpmsEngineOptions {
  name: string;
  cache?: boolean;
  bpmnEngine?: BpmnEngineOptions;
  dmnEngine?: DmnEngineOptions;
  cmmnEngine?: CmmnEngineOptions;
  datamodelEngine?: DataModelEngineOptions;
  datasourceEngine?: DataModelEngineOptions;
  meta?: any;
}

/**
 * Bpms Engine
 *
 * @export
 * @class BpmsEngine
 */
export class BpmsEngine {
  private static registry: { [name: string]: BpmsEngine } = {};
  private static default: BpmsEngine;
  private bpmnEngine: BpmnEngine | null;
  private dmnEngine: DmnEngine | null;
  private cmmnEngine: CmmnEngine | null;
  private datamodelEngine: DataModelEngine | null;
  private datasourceEngine: DataSourceEngine | null;
  private id: string = uuidv1();
  private name: string;
  private options: BpmsEngineOptions;
  constructor(options?: BpmsEngineOptions) {
    this.name = "";
    this.options = { name: this.name };
    this.bpmnEngine = null;
    this.dmnEngine = null;
    this.cmmnEngine = null;
    this.datamodelEngine = null;
    this.datasourceEngine = null;
    this.init(options);
  }

  private init(options: BpmsEngineOptions | undefined) {
    this.options = options || { name: "BpmsEngine-" + this.id };
    this.options.cache = this.options.cache ? this.options.cache : true;
    this.name = this.options.name;
    if (this.options.cache) {
      if (!BpmsEngine.registry[this.name]) {
        BpmsEngine.registry[this.name] = this;
      } else {
        throw new Error(
          `The BpmsEngine with current name '${this.name}' already exist in cache`,
        );
      }
    }
    this.bpmnEngine = BpmnEngine.createEngine(this, {
      name: this.name,
      ...this.options.bpmnEngine,
    });
    this.dmnEngine = DmnEngine.createEngine(this, {
      name: this.name,
      ...this.options.bpmnEngine,
    });
    this.cmmnEngine = CmmnEngine.createEngine(this, {
      name: this.name,
      ...this.options.cmmnEngine,
    });
    this.datamodelEngine = DataModelEngine.createEngine(this, {
      name: this.name,
      ...this.options.datamodelEngine,
    });
    this.datasourceEngine = DataSourceEngine.createEngine(this, {
      name: this.name,
      ...this.options.datasourceEngine,
    });
  }

  public static createEngine(options?: BpmsEngineOptions): BpmsEngine {
    const eng = new BpmsEngine(options);
    return eng;
  }

  public static getById(id: string): BpmsEngine | null {
    const x = Object.entries(BpmsEngine.registry).find((xx) => xx[1].Id === id);
    if (x) {
      return x[1];
    } else {
      return null;
    }
  }
  public static getByName(name: string): BpmsEngine {
    return BpmsEngine.registry[name];
  }
  public static list(): BpmsEngine[] {
    return Object.entries(BpmsEngine.registry).map((xx) => xx[1]);
  }
  public static reset(): void {
    BpmsEngine.registry = {};
  }

  public static remove(name: string): boolean {
    if (BpmsEngine.registry[name]) {
      delete BpmsEngine.registry[name];
      return true;
    } else {
      return false;
    }
  }

  public async reload(options?: BpmsEngineOptions | undefined): Promise<void> {
    if (options) {
      options.name = this.options.name;
    }
    this.init(options || this.options);
    return ;
  }

  public get Options(): BpmnEngineOptions {
    return this.options;
  }

  public get Id(): string {
    return this.id;
  }

  public get Name(): string {
    return this.name;
  }
  public get BpmnEngine(): BpmnEngine {
    return this.bpmnEngine as any;
  }
  public get DmnEngine(): DmnEngine {
    return this.dmnEngine as any;
  }

  public get CmmnEngine(): CmmnEngine {
    return this.cmmnEngine as any;
  }


  public get DataModelEngine(): DataModelEngine {
    return this.datamodelEngine as any;
  }

  public get DataSourceEngine(): DataSourceEngine {
    return this.datasourceEngine as any;
  }

  public static get Default() {
    if (!BpmsEngine.default) {
      BpmsEngine.default = BpmsEngine.createEngine({ name: "default" });
    }
    return BpmsEngine.default;
  }
}
