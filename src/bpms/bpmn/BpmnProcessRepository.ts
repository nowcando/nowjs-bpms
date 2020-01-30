/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface BpmnProcessModel {
    id: string;
    name: string;
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
            storageName: 'BpmnProcess',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
