/* eslint-disable @typescript-eslint/no-empty-interface */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface BpmsHistoryModel {
    id?: string;
    createdAt?: string;
    source?: string;
    tenantId: string;
    userId: string;

    type?: string;
}

export interface HistoryRepository<T extends BpmsHistoryModel = BpmsHistoryModel> extends BpmsRepository<T> {
    // implement
}
export class HistoryMemoryRepository extends BpmsBaseMemoryRepository<BpmsHistoryModel>
    implements HistoryRepository<BpmsHistoryModel> {
    constructor() {
        super({
            storageName: 'BpmsHistory',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
