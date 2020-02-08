/* eslint-disable @typescript-eslint/no-empty-interface */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface IdentityResourceModel {
    id: string;
    name: string;
}

export interface IdentityResourceRepository<TResource extends IdentityResourceModel = IdentityResourceModel>
    extends BpmsRepository<TResource> {
    // implement
}

export class IdentityResourceMemoryRepository extends BpmsBaseMemoryRepository<IdentityResourceModel>
    implements IdentityResourceRepository<IdentityResourceModel> {
    constructor() {
        super({
            storageName: 'BpmsIdentityResource',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
