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
    refTenantId?: string;
    refProcessInstanceId?: string;
    refProcessId?: string;
    refProcessExecutionId?: string;
    refActivityId?: string;
    createdAt?: Date;
    seenAt?: Date;
    updatedAt?: Date;
    completedAt?: Date;
    dueDate?: Date;
    followUpDate?: Date;
    tags?: string;
    categories?: string;

    completed?: boolean;
    seen?: boolean;

    views?: string;
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
            storageName: 'Job',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
