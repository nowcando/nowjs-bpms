/* eslint-disable @typescript-eslint/no-empty-interface */
import { QueryOptions, QueryResult, ScalarOptions, BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface HistoryData {
    id?: string;
    createdAt?: string;
    source?: string;
    tenantId: string;
    userId: string;

    type?: string;
}

export interface HistoryRepository<T extends HistoryData = HistoryData> extends BpmsRepository<T> {
    // implement
}
export class HistoryMemoryRepository extends BpmsBaseMemoryRepository<HistoryData>
    implements HistoryRepository<HistoryData> {
    constructor() {
        super({
            storageName: 'History',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
