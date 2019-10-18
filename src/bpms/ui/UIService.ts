import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "..";

export interface UIServiceOptions {
  name: string;
}

export class UIService {

  private views: any[] = [];
  private id: string = uuidv1();
  private options: UIServiceOptions;
  constructor(
    private bpmsEngine?: BpmsEngine,
    options?: UIServiceOptions,
  ) {
    this.options = options || { name: "UIService" + this.id };
    //   this.taskRepository =
    //     this.options.tenantRepository || (new DynamicViewMemoryRepository<T>() as any);
  }

  public static createService(
    options?: UIServiceOptions,
  ): UIService;
  public static createService(
    bpmsEngine?: BpmsEngine,
    options?: UIServiceOptions,
  ): UIService;
  public static createService(
    arg1?: BpmsEngine | UIServiceOptions,
    arg2?: UIServiceOptions,
  ): UIService {
    if (arg1 instanceof BpmsEngine) {
      return new UIService(arg1, arg2);
    }
    return new UIService(undefined, arg1);
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

  public async registerProcessViews(processName: string, view: any): Promise<any> {
    const d = {processName, view};
    this.views.push(d);
    return d;
  }
  public async findView(processName: string, viewName: string): Promise<any> {
    return this.views.find((xx) => xx.processName === processName && xx.name === viewName);
  }
  public async listViews(): Promise<any[]> {
    return this.views;
  }


}
