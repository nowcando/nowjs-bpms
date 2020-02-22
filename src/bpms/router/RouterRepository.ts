/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface BpmsRouteModel {
    systemId?: string;
    systemName?: string;
    definitionId?: string;
    definitionName?: string;
    definitionVersion?: number;
    processName?: string;
    processId?: string;
    id?: string;
    type?: 'static' | 'dynamic';
    key?: string;
    icon?: string;
    class?: string;
    target?: string;
    title?: string;
    enabled?: boolean;
    name: string;
    displayOrder?: string;
    category?: string;
    tags?: string[];
    authorization?: string;
    author?: string;
    route: string;
    variables?: Record<string, any>;
    createdAt?: string;
}

export interface RouterRepository<T extends BpmsRouteModel = BpmsRouteModel> extends BpmsRepository<T> {
    // implement
}

export class RouerMemoryRepository extends BpmsBaseMemoryRepository<BpmsRouteModel>
    implements RouterRepository<BpmsRouteModel> {
    constructor() {
        super({
            storageName: 'BpmsRouter',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
