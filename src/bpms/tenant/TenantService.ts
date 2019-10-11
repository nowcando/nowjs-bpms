import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "../BpmsEngine";
import { TenantMemoryRepository, TenantRepository } from "./TenantRepository";

export interface Tenant {
  id: string;
  name: string;
}

export interface TenantServiceOptions {
  tenantRepository?: TenantRepository;
  name: string;
}
export class TenantService<T extends Tenant = Tenant> {
  private taskRepository: TenantRepository<T>;
  private id: string = uuidv1();
  private options: TenantServiceOptions;
  constructor(private bpmsEngine?: BpmsEngine, options?: TenantServiceOptions) {
    this.options = options || { name: "TenantService" + this.id };
    this.taskRepository =
      this.options.tenantRepository || (new TenantMemoryRepository<T>() as any);
  }

  public static createService(options?: TenantServiceOptions): TenantService;
  public static createService(
    bpmsEngine?: BpmsEngine,
    options?: TenantServiceOptions,
  ): TenantService;
  public static createService(
    arg1?: BpmsEngine | TenantServiceOptions,
    arg2?: TenantServiceOptions,
  ): TenantService {
    if (arg1 instanceof BpmsEngine) {
      return new TenantService(arg1, arg2);
    }
    return new TenantService(undefined, arg1);
  }
  public async create(tenant: T): Promise<T> {
      return this.taskRepository.create(tenant);
  }
  public async list(): Promise<T[]> {
      return this.taskRepository.list();
    }
  public async find(tenantId: string): Promise<T> {
    return this.taskRepository.find(tenantId);
  }
  public async remove(tenantId: string): Promise<boolean> {
    return this.taskRepository.remove(tenantId);
  }
}
