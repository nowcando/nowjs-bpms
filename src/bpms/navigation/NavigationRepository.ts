/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface NavigationModel {
    definitionName: string;
    processName: string;
    processId: string;
    definitionId: string;
    id: string;
    type: string;
    key: string;
    icon: string;
    target: string;
    title: string;
    enabled: string;
    order: string;
    category: string;
    tags: string;
    defaultView: string;
    allowedViews: string;
    authorization: string;
}

export interface NavigationRepository<T extends NavigationModel = NavigationModel> extends BpmsRepository<T> {
    // implement
}

export class NavigationMemoryRepository extends BpmsBaseMemoryRepository<NavigationModel>
    implements NavigationRepository<NavigationModel> {
    constructor() {
        super({
            storageName: 'Navigation',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
