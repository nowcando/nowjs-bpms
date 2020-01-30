/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';
export interface OrganizationEmployeePositionModel {
    id: string;
    name: string;
}
export interface OrganizationEmployeePositionRepository<
    T extends OrganizationEmployeePositionModel = OrganizationEmployeePositionModel
> extends BpmsRepository<T> {
    // tenant
}
export class OrganizationEmployeePositionMemoryRepository
    extends BpmsBaseMemoryRepository<OrganizationEmployeePositionModel>
    implements OrganizationEmployeePositionRepository<OrganizationEmployeePositionModel> {
    constructor() {
        super({
            storageName: 'OrganizationEmployeePosition',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
