/* eslint-disable @typescript-eslint/no-empty-interface */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface IdentityUserGroupModel {
    id: string;
    name: string;
}

export interface IdentityUserGroupRepository<TUserGroup extends IdentityUserGroupModel = IdentityUserGroupModel>
    extends BpmsRepository<TUserGroup> {
    // implement
}

export class IdentityUserGroupMemoryRepository extends BpmsBaseMemoryRepository<IdentityUserGroupModel>
    implements IdentityUserGroupRepository<IdentityUserGroupModel> {
    constructor() {
        super({
            storageName: 'IdentityUserGroup',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
