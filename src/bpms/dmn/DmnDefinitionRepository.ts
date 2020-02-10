/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface DmnDefinitionModel {
    name: string;
    definitions: any;

    persistedAt: Date;
}
export interface DmnDefinitionRepository<T extends DmnDefinitionModel = DmnDefinitionModel> extends BpmsRepository<T> {
    // count(): Promise<number>;
    // list<R extends DmnDefinitionPersistedData>(options?: DmnDefinitionListOptions): Promise<R[]>;
    // find<R extends DmnDefinitionPersistedData>(options: DmnDefinitionFindOptions): Promise<R | undefined>;
    // load<R extends DmnDefinition>(options: R): Promise<R[]>;
    // persist(options: T): Promise<boolean>;
}

export class DmnDefinitionMemoryRepository extends BpmsBaseMemoryRepository<DmnDefinitionModel>
    implements DmnDefinitionRepository<DmnDefinitionModel> {
    constructor() {
        super({
            storageName: 'BpmsDmnDefinition',
            properties: {
                name: { type: 'string' },
            },
        });
    }
}
