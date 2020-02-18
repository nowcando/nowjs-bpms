/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository } from '../data/Repository';

export interface JobModel {
    id?: string;
    title?: string;
    descriptipns?: string;
    name?: string;
    assignee?: string;
    priority?: string;
    tenantId?: string;
    processDefinitionId?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    processInstanceId?: string;
    processInstanceName?: string;
    processExecutionId?: string;
    createdAt?: Date;
    seenAt?: Date;
    updatedAt?: Date;
    completed?: boolean;
    completedAt?: Date;
    tags?: string;
    categories?: string;
}

export interface JobQueryFilter {
    [name: string]: string;
}

export interface JobRepository<T extends JobModel = JobModel> extends BpmsRepository<T> {
    // other methodes
}

export class JobMemoryRepository extends BpmsBaseMemoryRepository<JobModel> implements JobRepository<JobModel> {
    constructor() {
        super({
            storageName: 'BpmsJob',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
