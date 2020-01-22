import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "../BpmsEngine";
import { Job, JobMemoryRepository, JobQuery, JobQueryFilter, JobRepository } from "./JobRepository";

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

export interface JobServiceOptions {
    taskRepository?: JobRepository;
    name: string;
}
export class JobService<T extends Job = Job> {
    private taskRepository: JobRepository<T>;
    private id: string = uuidv1();
    private options: JobServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: JobServiceOptions) {
        this.options = options || { name: "JobService" + this.id };
        this.taskRepository = this.options.taskRepository || (new JobMemoryRepository<T>() as any);
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
        return this.taskRepository;
    }
    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }
    public async createJob(task: T): Promise<T> {
        return this.taskRepository.createJob(task);
    }
    public async removeJob(taskId: string): Promise<boolean> {
        return this.taskRepository.removeJob(taskId);
    }

    public async findJob(taskId: string): Promise<T> {
        return this.taskRepository.findJob(taskId);
    }

    public async updateJobDueDate(taskId: string, dueDate: Date | undefined): Promise<T> {
        return this.taskRepository.updateJobDueDate(taskId, dueDate);
    }
    public async updateJobFollowUpDate(taskId: string, followUpDate: Date | undefined): Promise<T> {
        return this.taskRepository.updateJobFollowUpDate(taskId, followUpDate);
    }
    public async updateJobTags(taskId: string, tags: string | undefined): Promise<T> {
        return this.taskRepository.updateJobTags(taskId, tags);
    }
    public async updateJobCategories(taskId: string, categories: string | undefined): Promise<T> {
        return this.taskRepository.updateJobCategories(taskId, categories);
    }
    public async findJobs(...taskId: string[]): Promise<T[]> {
        return this.taskRepository.findJobs(...taskId);
    }
    public async taskCompleted(taskId: string): Promise<T> {
        return this.taskRepository.taskCompleted(taskId);
    }
    public async taskSeen(taskId: string): Promise<T> {
        return this.taskRepository.taskSeen(taskId);
    }
    public async countJobs(options?: JobQueryFilter): Promise<number> {
        return this.taskRepository.countJobs(options);
    }
    public async queryJobs(options?: JobQuery): Promise<T[]> {
        return this.taskRepository.queryJobs(options);
    }
}
