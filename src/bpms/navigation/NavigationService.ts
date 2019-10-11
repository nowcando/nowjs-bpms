import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "..";

export interface NavigationServiceOptions {
  name: string;
}

export class NavigationService {
  private id: string = uuidv1();
  private options: NavigationServiceOptions;
  constructor(
    private bpmsEngine?: BpmsEngine,
    options?: NavigationServiceOptions,
  ) {
    this.options = options || { name: "NavigationService" + this.id };
    //   this.taskRepository =
    //     this.options.tenantRepository || (new NavigationMemoryRepository<T>() as any);
  }

  public static createService(
    options?: NavigationServiceOptions,
  ): NavigationService;
  public static createService(
    bpmsEngine?: BpmsEngine,
    options?: NavigationServiceOptions,
  ): NavigationService;
  public static createService(
    arg1?: BpmsEngine | NavigationServiceOptions,
    arg2?: NavigationServiceOptions,
  ): NavigationService {
    if (arg1 instanceof BpmsEngine) {
      return new NavigationService(arg1, arg2);
    }
    return new NavigationService(undefined, arg1);
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
}
