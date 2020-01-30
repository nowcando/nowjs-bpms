import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { JobModel, JobMemoryRepository, JobRepository } from './JobRepository';
import { QueryOptions, QueryResult, ScalarOptions, IdExpression, FilterExpression } from '../data/Repository';

// export class Job {
//    private data: JobData;
//    constructor(data?: JobData) {
//       this.data = data || {id: uuidv1()};
//    }
//    public get Id(): string {
//       return this.data.id;
//    }
//    public get Title(): string {
//       return this.data.title;
//    }
//    public get Description(): string {}
//    public get Name(): string {}
//    public get Assignee(): string {}
//    public get Priority(): string {}

//    public get RefTenantId(): string {}
//    public get RefProcessInstanceId(): string {}
//    public get RefProcessId(): string {}
//    public get RefJobId(): string {}

//    public get CreatedAt(): Date {}
//    public get SeenAt(): Date {}
//    public get UpdatedAt(): Date {}
//    public get CompletedAt(): Date {}
//    public get DueDate(): Date {}
//    public get FollowUpDate(): Date {}

//    public get Tags(): string {}
//    public get Categories(): string {}
// }
export interface BpmsJob {
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
export interface JobServiceOptions {
    jobRepository?: JobRepository;
    name: string;
}
export class JobService<T extends BpmsJob = BpmsJob> {
    private jobRepository: JobRepository<T>;
    private id: string = uuidv1();
    private options: JobServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: JobServiceOptions) {
        this.options = options || { name: 'JobService' + this.id };
        this.jobRepository = this.options.jobRepository || (new JobMemoryRepository() as any);
    }

    public static createService(options?: JobServiceOptions): JobService;
    public static createService(bpmsEngine?: BpmsEngine, options?: JobServiceOptions): JobService;
    public static createService(arg1?: BpmsEngine | JobServiceOptions, arg2?: JobServiceOptions): JobService {
        if (arg1 instanceof BpmsEngine) {
            return new JobService(arg1, arg2);
        }
        return new JobService(undefined, arg1);
    }

    public get Id(): string {
        return this.id;
    }

    public get Name(): string {
        return this.options.name;
    }
    public get JobRepository(): JobRepository<T> {
        return this.jobRepository;
    }
    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }
    public async create(job: T): Promise<T> {
        return this.jobRepository.create(job);
    }
    public async remove(jobId: IdExpression): Promise<boolean> {
        return this.jobRepository.delete(jobId);
    }

    public async find(jobId: IdExpression): Promise<T | null> {
        return this.jobRepository.find(jobId);
    }

    public async findJobs(filter: FilterExpression): Promise<T[]> {
        return this.jobRepository.findAll(filter);
    }

    public async updateJobDueDate(jobId: string, dueDate: Date | undefined): Promise<T> {
        return this.jobRepository.update(jobId, { dueDate });
    }
    public async updateJobFollowUpDate(jobId: string, followUpDate: Date | undefined): Promise<T> {
        return this.jobRepository.update(jobId, { followUpDate });
    }
    public async updateJobTags(jobId: string, tags: string | undefined): Promise<T> {
        return this.jobRepository.update(jobId, { tags });
    }
    public async updateJobCategories(jobId: string, categories: string | undefined): Promise<T> {
        return this.jobRepository.update(jobId, { categories });
    }

    public async jobCompleted(jobId: string): Promise<T> {
        return this.jobRepository.update(jobId, { complete: true });
    }
    public async jobSeen(jobId: string): Promise<T> {
        return this.jobRepository.update(jobId, { seen: true });
    }
    public async count(filter?: FilterExpression): Promise<number> {
        return this.jobRepository.count('id', filter);
    }
}
