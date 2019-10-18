import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "..";

export interface NotificationServiceOptions {
  name: string;
}

export class NotificationService {

  private notifiations: any[] = [];
  private id: string = uuidv1();
  private options: NotificationServiceOptions;
  constructor(
    private bpmsEngine?: BpmsEngine,
    options?: NotificationServiceOptions,
  ) {
    this.options = options || { name: "NotificationService" + this.id };
    //   this.taskRepository =
    //     this.options.tenantRepository || (new DynamicViewMemoryRepository<T>() as any);
  }

  public static createService(
    options?: NotificationServiceOptions,
  ): NotificationService;
  public static createService(
    bpmsEngine?: BpmsEngine,
    options?: NotificationServiceOptions,
  ): NotificationService;
  public static createService(
    arg1?: BpmsEngine | NotificationServiceOptions,
    arg2?: NotificationServiceOptions,
  ): NotificationService {
    if (arg1 instanceof BpmsEngine) {
      return new NotificationService(arg1, arg2);
    }
    return new NotificationService(undefined, arg1);
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

  public async registerNotification(processName: string, view: any): Promise<any> {
    const d = {processName, view};
    this.notifiations.push(d);
    return d;
  }
  public async findNotification(processName: string, viewName: string): Promise<any> {
    return this.notifiations.find((xx) => xx.name === viewName);
  }
  public async listNotifications(): Promise<any[]> {
    return this.notifiations;
  }


}
