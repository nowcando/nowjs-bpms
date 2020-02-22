/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface BpmnDefinitionModel {
    id: string;
    name: string;
    definitions: any;

    systemId?: string;
    systemName?: string;

    category?: string;
    tags: string[];

    version: number;

    createdAt?: Date;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BpmnDefinitionRepository<T extends BpmnDefinitionModel = BpmnDefinitionModel>
    extends BpmsRepository<T> {
    // implement
}

export class BpmnDefinitionMemoryRepository extends BpmsBaseMemoryRepository<BpmnDefinitionModel>
    implements BpmnDefinitionRepository<BpmnDefinitionModel> {
    constructor() {
        super({
            storageName: 'BpmsBpmnDefinition',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
