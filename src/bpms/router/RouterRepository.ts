/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface BpmsRouteModel {
    definitionId: string;
    definitionName: string;
    definitionVersion: number;
    processId: string;
    processName: string;
    activityName: string;
    activityId: string;
    id?: string;
    route: string;
    title: string;
    name: string;
    displayOrder?: number;
    shortKey?: string;
    createdAt?: string;
}

export interface NavigationRepository<T extends BpmsRouteModel = BpmsRouteModel> extends BpmsRepository<T> {
    // implement
}

export class RoutingMemoryRepository extends BpmsBaseMemoryRepository<BpmsRouteModel>
    implements NavigationRepository<BpmsRouteModel> {
    constructor() {
        super({
            storageName: 'Router',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
