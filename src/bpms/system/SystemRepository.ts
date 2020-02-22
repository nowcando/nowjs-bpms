/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface BpmsSystemModel {
    id?: string;
    key?: string;
    icon: string;
    class: string;
    target: string;
    title: string;
    enabled?: boolean;
    name: string;
    displayOrder?: string;
    category?: string;
    tags?: string;
    createdAt?: string;
}

export interface SystemRepository<T extends BpmsSystemModel = BpmsSystemModel> extends BpmsRepository<T> {
    // implement
}

export class SystemMemoryRepository extends BpmsBaseMemoryRepository<BpmsSystemModel>
    implements SystemRepository<BpmsSystemModel> {
    constructor() {
        super({
            storageName: 'BpmsSystem',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
