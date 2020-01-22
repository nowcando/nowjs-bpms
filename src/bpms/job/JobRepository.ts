/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv1 } from "nowjs-core/lib/utils";

export interface Job {
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

export interface JobQuerySort {
    [name: string]: "asc" | "desc";
}
export interface JobQuery {
    filter?: JobQueryFilter;
    sort?: JobQuerySort;
}

export interface JobRepository<T extends Job = Job> {
    createJob(task: T): Promise<T>;
    removeJob(taskId: string): Promise<boolean>;

    findJob(taskId: string): Promise<T>;

    updateJobDueDate(taskId: string, dueDate: Date | undefined): Promise<T>;
    updateJobFollowUpDate(taskId: string, followUpDate: Date | undefined): Promise<T>;
    updateJobTags(taskId: string, tags: string | undefined): Promise<T>;
    updateJobCategories(taskId: string, categories: string | undefined): Promise<T>;
    findJobs(...taskId: string[]): Promise<T[]>;
    taskCompleted(taskId: string): Promise<T>;
    taskSeen(taskId: string): Promise<T>;
    countJobs(options?: JobQueryFilter): Promise<number>;
    queryJobs(options?: JobQuery): Promise<T[]>;
}

export class JobMemoryRepository<T extends Job = Job> implements JobRepository<T> {
    private tasks: T[] = [];
    public async createJob(task: T): Promise<T> {
        task.id = uuidv1();
        (task.createdAt = new Date()), this.tasks.push(task);
        return Promise.resolve(task);
    }
    public async removeJob(taskId: string): Promise<boolean> {
        const t = this.tasks.findIndex(xx => xx.id === taskId);
        if (t >= 0) {
            this.tasks.splice(t, 1);
        }
        return t as any;
    }
    public async findJob(taskId: string): Promise<T> {
        const t = this.tasks.find(xx => xx.id === taskId);
        return t as any;
    }
    public async updateJobDueDate(taskId: string, dueDate: Date | undefined): Promise<T> {
        const t = this.tasks.find(xx => xx.id === taskId);
        if (t) {
            t.updatedAt = new Date();
            t.dueDate = dueDate;
        }
        return t as any;
    }
    public async updateJobFollowUpDate(taskId: string, followUpDate: Date | undefined): Promise<T> {
        const t = this.tasks.find(xx => xx.id === taskId);
        if (t) {
            t.updatedAt = new Date();
            t.followUpDate = followUpDate;
        }
        return t as any;
    }
    public async updateJobTags(taskId: string, tags: string | undefined): Promise<T> {
        const t = this.tasks.find(xx => xx.id === taskId);
        if (t) {
            t.updatedAt = new Date();
            t.tags = tags;
        }
        return t as any;
    }
    public async updateJobCategories(taskId: string, categories: string | undefined): Promise<T> {
        const t = this.tasks.find(xx => xx.id === taskId);
        if (t) {
            t.updatedAt = new Date();
            t.categories = categories;
        }
        return t as any;
    }
    public async findJobs(...taskId: string[]): Promise<T[]> {
        const t = this.tasks.filter(xx => taskId.includes(xx.id || ""));
        return t as any;
    }
    public async taskCompleted(taskId: string): Promise<T> {
        const t = this.tasks.find(xx => xx.id === taskId);
        if (t) {
            t.completedAt = new Date();
            t.completed = true;
        }
        return t as any;
    }
    public async taskSeen(taskId: string): Promise<T> {
        const t = this.tasks.find(xx => xx.id === taskId);
        if (t) {
            t.seenAt = new Date();
            t.seen = true;
        }
        return t as any;
    }
    public async countJobs(options?: JobQueryFilter | undefined): Promise<number> {
        const t = this.tasks.length;
        return t as any;
    }
    public async queryJobs(options?: JobQuery | undefined): Promise<T[]> {
        const t = this.tasks.slice();
        return t as any;
    }
}
