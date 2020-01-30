/* eslint-disable @typescript-eslint/no-empty-interface */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface IdentityGroupModel {
    id: string;
    name: string;
}

export interface IdentityGroupRepository<TGroup extends IdentityGroupModel = IdentityGroupModel>
    extends BpmsRepository<TGroup> {
    // implement
}

export class IdentityGroupMemoryRepository extends BpmsBaseMemoryRepository<IdentityGroupModel>
    implements IdentityGroupRepository<IdentityGroupModel> {
    constructor() {
        super({
            storageName: 'IdentityGroup',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
