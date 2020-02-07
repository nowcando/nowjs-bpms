/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface BpmnProcessModel {
    id: string;
    definitionId: string;
    name: string;
    state: string;
    stopped: boolean;
    createdAt?: Date;
    persistedAt?: Date;
    data: any;
}

export interface BpmnProcessRepository<T extends BpmnProcessModel = BpmnProcessModel> extends BpmsRepository<T> {
    // implement
}
export class BpmnProcessMemoryRepository extends BpmsBaseMemoryRepository<BpmnProcessModel>
    implements BpmnProcessRepository<BpmnProcessModel> {
    constructor() {
        super({
            storageName: 'BpmsProcess',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                definitionId: { type: 'string' },
                state: { type: 'string' },
                stopped: { type: 'boolean' },
            },
        });
    }
}
