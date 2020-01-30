/* eslint-disable @typescript-eslint/no-empty-interface */
import { BpmsRepository, BpmsBaseMemoryRepository } from './Repository';

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface DataModel {
    name: string;

    definitions: any;
    persistedAt?: Date;
}
export interface DataModelRepository extends BpmsRepository<DataModel> {
    // implement
}

export class DataModelMemoryRepository extends BpmsBaseMemoryRepository<DataModel> implements DataModelRepository {
    constructor() {
        super({
            storageName: 'DataModel',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
