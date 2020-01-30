/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { BpmsRepository, BpmsBaseMemoryRepository, IdExpression } from '../data/Repository';

export interface IdentityUserModel {
    id: string;
    name: string;
}

export interface IdentityUserRepository<TUser extends IdentityUserModel = IdentityUserModel>
    extends BpmsRepository<TUser> {
    isAuhtenticated(uid: IdExpression, sessionId?: string): Promise<boolean>;
}

export class IdentityUserMemoryRepository extends BpmsBaseMemoryRepository<IdentityUserModel>
    implements IdentityUserRepository<IdentityUserModel> {
    public async isAuhtenticated(uid: IdExpression, sessionId?: string | undefined): Promise<boolean> {
        return true;
    }
    constructor() {
        super({
            storageName: 'IdentityUser',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
