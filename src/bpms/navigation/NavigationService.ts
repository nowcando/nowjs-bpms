import "nowjs-core";
import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "../BpmsEngine";

export interface NavigationServiceOptions {
  name: string;
}

export interface NavigationData {
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
  defaultView: string;
  allowedViews: string;
  authorization: string;
}

export class NavigationService {
  private navigations: NavigationData[] = [];
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

  public async registerNavigations(...navs: NavigationData[]) {
    this.navigations.push(...navs);
    return;
  }
  public async listNavigations(): Promise<NavigationData[]> {
    return this.navigations.slice();
  }
  public async listViewNavigations() {
    if (this.BpmsEngine) {
      const views = await this.BpmsEngine.UIService.listViews();
      const navViews = this.navigations
        .linq()
        .groupBy((xx) => xx.category)
        .toArray()
        .map((xx) => {
          return {
            title: xx.key,
            items: xx.values.toArray().map((nn) => {
              return {
                ...nn,
                views: views.filter(
                  (vv) =>
                    vv.view.key.startsWith(nn.key),
                ),
              };
            }),
          };
        });

      return navViews;
    }
    return [];
  }
}
