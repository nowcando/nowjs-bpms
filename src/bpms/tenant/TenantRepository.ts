/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';
export interface TenantModel {
    id: string;
    name: string;
}
export interface TenantRepository<T extends TenantModel = TenantModel> extends BpmsRepository<T> {
    // tenant
}
export class TenantMemoryRepository extends BpmsBaseMemoryRepository<TenantModel>
    implements TenantRepository<TenantModel> {
    constructor() {
        super({
            storageName: 'Tenant',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
