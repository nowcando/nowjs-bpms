/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';
export interface OrganizationPositionModel {
    id: string;
    name: string;
}
export interface OrganizationPositionRepository<T extends OrganizationPositionModel = OrganizationPositionModel>
    extends BpmsRepository<T> {
    // tenant
}
export class OrganizationPositionMemoryRepository extends BpmsBaseMemoryRepository<OrganizationPositionModel>
    implements OrganizationPositionRepository<OrganizationPositionModel> {
    constructor() {
        super({
            storageName: 'OrganizationPosition',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
