/* eslint-disable @typescript-eslint/no-explicit-any */
import { uuidv1 } from 'nowjs-core/lib/utils/UuidUtils';
import { BpmnEngine, BpmnEngineOptions } from './bpmn';
import { CmmnEngine, CmmnEngineOptions } from './cmmn';
import { DmnEngine, DmnEngineOptions } from './dmn';
import { HistoryService, HistoryServiceOptions } from './history/HistoryService';
import { IdentityService, IdentityServiceOptions } from './identity/IdentityService';
import { JobService, JobServiceOptions } from './job/JobService';
import { RouterService, RouterServiceOptions } from './router/RouterService';
import { NotificationService } from './notification/NotificationService';
import { QueryService, QueryServiceOptions } from './query/QueryService';
import { TaskService, TaskServiceOptions } from './task/TaskService';
import { TenantService, TenantServiceOptions } from './tenant/TenantService';
import { UIService, UIServiceOptions } from './ui/UIService';
import { DataModelServiceOptions, DataModelService } from './data/DataModelService';
import { DataSourceServiceOptions, DataSourceService } from './data/DataSourceService';
import { OrganizationService, OrganizationServiceOptions } from './organization/OrganizationService';
export interface BpmsEngineOptions {
    name: string;
    cache?: boolean;
    bpmnEngine?: BpmnEngineOptions;
    dmnEngine?: DmnEngineOptions;
    cmmnEngine?: CmmnEngineOptions;
    datamodelService?: DataModelServiceOptions;
    datasourceService?: DataSourceServiceOptions;
    identityService?: IdentityServiceOptions;
    organizationService?: OrganizationServiceOptions;
    historyService?: HistoryServiceOptions;
    taskService?: TaskServiceOptions;
    tenantService?: TenantServiceOptions;
    routerService?: RouterServiceOptions;
    uiService?: UIServiceOptions;
    jobService?: JobServiceOptions;
    queryService?: QueryServiceOptions;
    notificationService?: NotificationService;
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
    private bpmnEngine!: BpmnEngine;
    private dmnEngine!: DmnEngine;
    private cmmnEngine!: CmmnEngine;
    private datamodelService!: DataModelService;
    private datasourceService!: DataSourceService;
    private historyService!: HistoryService;
    private identityService!: IdentityService;
    private organizationService!: OrganizationService;
    private taskService!: TaskService;
    private tenantService!: TenantService;
    private uiService!: UIService;
    private queryService!: QueryService;
    private jobService!: JobService;
    private routerService!: RouterService;
    private notificationService!: NotificationService;

    private id: string = uuidv1();
    private name: string;
    private options: BpmsEngineOptions;
    constructor(options?: BpmsEngineOptions) {
        this.name = '';
        this.options = { name: this.name };
        this.init(options);
    }

    private init(options: BpmsEngineOptions | undefined): void {
        this.options = options || { name: 'BpmsEngine-' + this.id };
        this.options.cache = this.options.cache ? this.options.cache : true;
        this.name = this.options.name;
        if (this.options.cache) {
            if (!BpmsEngine.registry[this.name]) {
                BpmsEngine.registry[this.name] = this;
            } else {
                throw new Error(`The BpmsEngine with current name '${this.name}' already exist in cache`);
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
        this.datamodelService = DataModelService.createEngine(this, {
            name: this.name,
            ...this.options.datamodelService,
        });
        this.datasourceService = DataSourceService.createEngine(this, {
            name: this.name,
            ...this.options.datasourceService,
        });
        this.tenantService = TenantService.createService(this, {
            name: this.name,
            ...this.options.tenantService,
        });
        this.identityService = IdentityService.createService(this, {
            name: this.name,
            ...this.options.identityService,
        });
        this.organizationService = OrganizationService.createService(this, {
            name: this.name,
            ...this.options.organizationService,
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
        this.jobService = JobService.createService(this, {
            name: this.name,
            ...this.options.jobService,
        });
        this.routerService = RouterService.createService(this, {
            name: this.name,
            ...this.options.routerService,
        });
        this.notificationService = NotificationService.createService(this, {
            name: this.name,
            ...this.options.notificationService,
        });
        // Query service must be last for populating repositories
        this.queryService = QueryService.createService(this, {
            name: this.name,
            ...this.options.queryService,
        });
    }

    public static createEngine(options?: BpmsEngineOptions): BpmsEngine {
        const eng = new BpmsEngine(options);
        return eng;
    }

    public static getById(id: string): BpmsEngine | null {
        const x = Object.entries(BpmsEngine.registry).find(xx => xx[1].Id === id);
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
        return Object.entries(BpmsEngine.registry).map(xx => xx[1]);
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
        return;
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
        return this.bpmnEngine;
    }
    public get DmnEngine(): DmnEngine {
        return this.dmnEngine as any;
    }

    public get CmmnEngine(): CmmnEngine {
        return this.cmmnEngine as any;
    }

    public get DataModelService(): DataModelService {
        return this.datamodelService as any;
    }

    public get DataSourceService(): DataSourceService {
        return this.datasourceService as any;
    }

    public get RouterService(): RouterService {
        return this.routerService as any;
    }
    public get UIService(): UIService {
        return this.uiService as any;
    }

    public get JobService(): QueryService {
        return this.jobService as any;
    }
    public get QueryService(): QueryService {
        return this.queryService as any;
    }

    public get NotificationService(): NotificationService {
        return this.notificationService as any;
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
    public get OrganizationService(): OrganizationService {
        return this.identityService as any;
    }
    public get HistoryService(): HistoryService {
        return this.historyService as any;
    }

    public static get Default(): BpmsEngine {
        if (!BpmsEngine.default) {
            BpmsEngine.default = BpmsEngine.createEngine({ name: 'default' });
        }
        return BpmsEngine.default;
    }
}
