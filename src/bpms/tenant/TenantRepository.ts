import { Tenant } from "./TenantService";
export interface TenantRepository<T extends Tenant = Tenant> {
  create(tenant: T): Promise<T>;
  list(): Promise<T[]>;
  find(tenantId: string): Promise<T>;
  remove(tenantId: string): Promise<boolean>;
}
export class TenantMemoryRepository<T extends Tenant = Tenant>
  implements TenantRepository<T> {
  public async create(tenant: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public async list(): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  public async find(tenantId: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public async remove(tenantId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
