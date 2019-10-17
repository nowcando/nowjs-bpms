import { uuidv1 } from "nowjs-core/lib/utils/UuidUtils";
import { BpmnEngine, BpmnEngineOptions } from "./bpmn";
import { CmmnEngine, CmmnEngineOptions } from "./cmmn";
import { DataModelEngine, DataModelEngineOptions, DataSourceEngine } from "./data";
import { DmnEngine, DmnEngineOptions } from "./dmn";
import { HistoryService, HistoryServiceOptions } from "./history/HistoryService";
import { IdentityService, IdentityServiceOptions } from "./identity/IdentityService";
import { NavigationService, NavigationServiceOptions } from "./navigation/NavigationService";
import { TaskService, TaskServiceOptions } from "./task/TaskService";
import { TenantService, TenantServiceOptions } from "./tenant/TenantService";
import { UIService, UIServiceOptions } from "./ui/UIService";
export interface BpmsEngineOptions {
  name: string;
  cache?: boolean;
  bpmnEngine?: BpmnEngineOptions;
  dmnEngine?: DmnEngineOptions;
  cmmnEngine?: CmmnEngineOptions;
  datamodelEngine?: DataModelEngineOptions;
  datasourceEngine?: DataModelEngineOptions;
  identityService?: IdentityServiceOptions;
  historyService?: HistoryServiceOptions;
  taskService?: TaskServiceOptions;
  tenantService?: TenantServiceOptions;
  navigationService?: NavigationServiceOptions;
  uiService?: UIServiceOptions;
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
  private historyService: HistoryService | null;
  private identityService: IdentityService | null;
  private taskService: TaskService | null;

  private tenantService: TenantService | null;
  private uiService: UIService | null;
  private navigationService: NavigationService | null;
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
    this.historyService = null;
    this.identityService = null;
    this.taskService = null;
    this.tenantService = null;
    this.navigationService = null;
    this.uiService = null;
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
      ...this.options.dmnEngine,
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
    this.tenantService = TenantService.createService(this, {
      name: this.name,
      ...this.options.tenantService,
    });
    this.identityService = IdentityService.createService(this, {
      name: this.name,
      ...this.options.identityService,
    });
    this.historyService = HistoryService.createService(this, {
      name: this.name,
      ...this.options.historyService,
    });
    this.taskService = TaskService.createService(this, {
      name: this.name,
      ...this.options.taskService,
    });
    this.uiService = UIService.createService(this, {
      name: this.name,
      ...this.options.uiService,
    });
    this.navigationService = NavigationService.createService(this, {
      name: this.name,
      ...this.options.navigationService,
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

  public get NavigationService(): NavigationService {
    return this.navigationService as any;
  }
  public get UIService(): UIService {
    return this.uiService as any;
  }
  public get TenantService(): TenantService {
    return this.tenantService as any;
  }
  public get TaskService(): TaskService {
    return this.taskService as any;
  }
  public get IdentityService(): IdentityService {
    return this.identityService as any;
  }
  public get HistoryService(): HistoryService {
    return this.historyService as any;
  }

  public static get Default() {
    if (!BpmsEngine.default) {
      BpmsEngine.default = BpmsEngine.createEngine({ name: "default" });
    }
    return BpmsEngine.default;
  }
}
