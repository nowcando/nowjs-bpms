/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';
export interface OrganizationEmployeeModel {
    id: string;
    name: string;
}
export interface OrganizationEmployeeRepository<T extends OrganizationEmployeeModel = OrganizationEmployeeModel>
    extends BpmsRepository<T> {
    // tenant
}
export class OrganizationEmployeeMemoryRepository extends BpmsBaseMemoryRepository<OrganizationEmployeeModel>
    implements OrganizationEmployeeRepository<OrganizationEmployeeModel> {
    constructor() {
        super({
            storageName: 'OrganizationEmployee',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
