/* eslint-disable @typescript-eslint/no-empty-interface */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface IdentityUserClaimModel {
    id: string;
    name: string;
}

export interface IdentityUserClaimRepository<TUserClaim extends IdentityUserClaimModel = IdentityUserClaimModel>
    extends BpmsRepository<TUserClaim> {
    // implement
}

export class IdentityUserClaimMemoryRepository extends BpmsBaseMemoryRepository<IdentityUserClaimModel>
    implements IdentityUserClaimRepository<IdentityUserClaimModel> {
    constructor() {
        super({
            storageName: 'BpmsIdentityUserClaim',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
