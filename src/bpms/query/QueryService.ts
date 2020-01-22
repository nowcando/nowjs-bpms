import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "..";

export interface QueryServiceOptions {
  name: string;
}

export interface ProcessViewData {
  definitionName: string;
  view: ProcessView;
}
export interface ProcessView {
  definitionName: string;
  processName: string;
  processId: string;
  definitionId: string;
  id: string;
  type: string;
  key: string;
  icon: string;
  target: string;
  title: string;
  enabled: string;
  order: string;
  category: string;
  tags: string;
  author: string;
  authorization: string;
  body: string;
}

export class QueryService {
  private views: any[] = [];
  private id: string = uuidv1();
  private options: QueryServiceOptions;
  constructor(private bpmsEngine?: BpmsEngine, options?: QueryServiceOptions) {
    this.options = options || { name: "QueryService" + this.id };
    //   this.taskRepository =
    //     this.options.tenantRepository || (new DynamicViewMemoryRepository<T>() as any);
  }

  public static createService(options?: QueryServiceOptions): QueryService;
  public static createService(
    bpmsEngine?: BpmsEngine,
    options?: QueryServiceOptions
  ): QueryService;
  public static createService(
    arg1?: BpmsEngine | QueryServiceOptions,
    arg2?: QueryServiceOptions
  ): QueryService {
    if (arg1 instanceof BpmsEngine) {
      return new QueryService(arg1, arg2);
    }
    return new QueryService(undefined, arg1);
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

  public async query<R>(expression: any) {
      
  }

  //   public async registerProcessViews(definitionName: string, view: any): Promise<ProcessViewData> {
  //     const d = {definitionName, view};
  //     this.views.push(d);
  //     return d;
  //   }
  //   public async findView(processName: string, viewName: string): Promise<ProcessViewData> {
  //     return this.views.find((xx) => xx.processName === processName && xx.name === viewName);
  //   }
  //   public async listViews(): Promise<ProcessViewData[]> {
  //     return this.views;
  //   }
}
