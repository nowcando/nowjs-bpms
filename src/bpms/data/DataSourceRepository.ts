/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryOptions, QueryResult, ScalarOptions, BpmsRepository, BpmsBaseMemoryRepository } from './Repository';

export interface DataSourceListOptions {
    name?: string;
}

export interface DataSourceFindOptions {
    name?: string;
}

export interface DataSourceLoadOptions {
    name: string;
}
export interface DataSourceRemoveOptions {
    name: string;
}
export interface DataSource {
    name: string;
    definitions: any;

    persistedAt?: Date;
}
export interface DataSourceRepository<T = DataSource> extends BpmsRepository<T> {
    // implement here
}

export class DataSourceMemoryRepository extends BpmsBaseMemoryRepository<DataSource>
    implements DataSourceRepository<DataSource> {
    constructor() {
        super({
            storageName: 'BpmsDataSource',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
