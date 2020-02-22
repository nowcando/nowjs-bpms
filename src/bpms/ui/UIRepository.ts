/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';
export interface UIModel {
    systemId?: string;
    systemName?: string;
    definitionId?: string;
    definitionName?: string;
    definitionVersion?: number;

    descriptions?: string;
    processId: string;
    processName: string;
    activityName: string;
    activityType: string;
    activityId: string;
    id?: string;
    name: string;
    title: string;
    type: string;
    target: string;
    renderEngine: string;
    renderEngineVersion: string;
    default: boolean;
    enabled: string;
    category: string;
    tags: string;
    displayOrder: string;
    icon: string;
    class: string;
    script: { resource?: string; format?: string; content: string };
    template: { resource?: string; format?: string; content: string };
    style: { resource?: string; format?: string; content: string };
    authorization: string;
    author: string;
    createdAt?: Date;
    actions: { name: string; description: string; value: any }[];
}
export interface UIRepository<T extends UIModel = UIModel> extends BpmsRepository<T> {
    // tenant
}
export class UIMemoryRepository extends BpmsBaseMemoryRepository<UIModel> implements UIRepository<UIModel> {
    constructor() {
        super({
            storageName: 'BpmsUI',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
