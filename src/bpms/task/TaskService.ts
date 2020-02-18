import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { TaskMemoryRepository, TaskRepository } from './TaskRepository';
import { QueryOptions, QueryResult, ScalarOptions, FilterExpression, IdExpression } from '../data/Repository';
import { BpmsService } from '../BpmsService';

// export class Task {
//    private data: TaskData;
//    constructor(data?: TaskData) {
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
//    public get RefTaskId(): string {}

//    public get CreatedAt(): Date {}
//    public get SeenAt(): Date {}
//    public get UpdatedAt(): Date {}
//    public get CompletedAt(): Date {}
//    public get DueDate(): Date {}
//    public get FollowUpDate(): Date {}

//    public get Tags(): string {}
//    public get Categories(): string {}
// }

export interface BpmsTask {
    id?: string;
    title?: string;
    descriptions?: string;
    type?: string;
    activityType?: string;
    name?: string;
    assignee?: { userId: IdExpression; username: string; fullname?: string; avatar?: string };
    priority?: string;
    tenantId?: string;
    processDefinitionId?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    processInstanceId?: string;
    processInstanceName?: string;
    processExecutionId?: string;
    activityId?: string;
    createdAt?: Date;
    seenAt?: Date;
    updatedAt?: Date;
    completedAt?: Date;
    dueDate?: Date;
    followUpDate?: Date;
    tags?: string;
    categories?: string;

    variables?: any;

    completed?: boolean;
    seen?: boolean;
}

export interface TaskServiceOptions {
    taskRepository?: TaskRepository;
    name: string;
}
export class TaskService<T extends BpmsTask = BpmsTask> implements BpmsService {
    private taskRepository: TaskRepository<T>;
    private id: string = uuidv1();
    private options: TaskServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: TaskServiceOptions) {
        this.options = options || { name: 'TaskService' + this.id };
        this.taskRepository = this.options.taskRepository || new TaskMemoryRepository();
    }

    public static createService(options?: TaskServiceOptions): TaskService;
    public static createService(bpmsEngine?: BpmsEngine, options?: TaskServiceOptions): TaskService;
    public static createService(arg1?: BpmsEngine | TaskServiceOptions, arg2?: TaskServiceOptions): TaskService {
        if (arg1 instanceof BpmsEngine) {
            return new TaskService(arg1, arg2);
        }
        return new TaskService(undefined, arg1);
    }

    public get Id(): string {
        return this.id;
    }

    public get Name(): string {
        return this.options.name;
    }
    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }

    public async clear(): Promise<void> {
        return this.taskRepository.clear();
    }
    public async create(task: T): Promise<T> {
        const r = await this.taskRepository.create(task);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The task has been created`,
            data: {
                processDefinitionId: r.processDefinitionId,
                processExecutionId: r.processExecutionId,
                processInstanceId: r.processInstanceId,
                processDefinitionVersion: r.processDefinitionVersion,
                activityId: r.activityId,
                activityType: r.activityType,
                tenantId: r.tenantId,
                type: r.type,
                taskId: r.id,
                taskName: r.name,
                assignee: r.assignee,
            },
            eventId: 100149,
        });
        return r;
    }
    public async remove(taskId: IdExpression): Promise<boolean> {
        const r = await this.taskRepository.delete(taskId);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The task has been removed`,
            data: {
                taskId: taskId,
            },
            eventId: 100146,
        });
        return r;
    }

    public async find(taskId: IdExpression): Promise<T | null>;
    public async find(filter: FilterExpression): Promise<T | null>;
    public async find(expression: IdExpression | FilterExpression): Promise<T | null> {
        return this.taskRepository.find(expression);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.taskRepository.findAll(filter);
    }
    public async count(filter?: FilterExpression): Promise<number> {
        return this.taskRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.taskRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.taskRepository.scalar(options);
    }

    public async updateTaskDueDate(taskId: string, dueDate: Date | undefined): Promise<T> {
        const d = { dueDate };
        const r = await this.taskRepository.update(taskId, d);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The task due date has been updated`,
            data: {
                taskId: r.id,
                taskName: r.name,
                dueDate: r.dueDate,
            },
            eventId: 100143,
        });
        return r;
    }
    public async updateTaskFollowUpDate(taskId: string, followUpDate: Date | undefined): Promise<T> {
        const d = { followUpDate };
        const r = await this.taskRepository.update(taskId, d);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The task followup date has been updated`,
            data: {
                taskId: r.id,
                taskName: r.name,
                followUpDate: r.followUpDate,
            },
            eventId: 100141,
        });
        return r;
    }
    public async updateTaskTags(taskId: string, tags: string | undefined): Promise<T> {
        const d = { tags };
        const r = await this.taskRepository.update(taskId, d);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The task tags has been updated`,
            data: {
                taskId: r.id,
                taskName: r.name,
                tags: r.tags,
            },
            eventId: 100138,
        });
        return r;
    }
    public async updateTaskCategories(taskId: string, categories: string | undefined): Promise<T> {
        const d = { categories };
        const r = await this.taskRepository.update(taskId, d);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The task categories has been updated`,
            data: {
                taskId: r.id,
                taskName: r.name,
                categories: r.categories,
            },
            eventId: 100136,
        });
        return r;
    }
    public async taskCompleted(taskId: string): Promise<T> {
        const d = { completed: true, completedAt: new Date() };
        const r = await this.taskRepository.update(taskId, d);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The task has been completed`,
            data: {
                taskId: r.id,
                taskName: r.name,
                completed: r.completed,
                completedAt: r.completedAt,
            },
            eventId: 100132,
        });
        return r;
    }
    public async taskSeen(taskId: string): Promise<T> {
        const d = { seen: true, seenAt: new Date() };
        const r = await this.taskRepository.update(taskId, d);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.Name,
            message: `The task has been seen`,
            data: {
                taskId: r.id,
                taskName: r.name,
                seen: r.seen,
                seenAt: r.seenAt,
            },
            eventId: 100128,
        });
        return r;
    }
}
