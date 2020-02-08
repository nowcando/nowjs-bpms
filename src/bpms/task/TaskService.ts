import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { TaskMemoryRepository, TaskRepository } from './TaskRepository';
import { QueryOptions, QueryResult, ScalarOptions, FilterExpression } from '../data/Repository';
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
    assignee?: string;
    priority?: string;
    tenantId?: string;
    processDefinitionId?: string;
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
        return this.taskRepository.create(task);
    }
    public async remove(taskId: string): Promise<boolean> {
        return this.taskRepository.delete(taskId);
    }

    public async find(taskId: string): Promise<T | null> {
        return this.taskRepository.find(taskId);
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
        return this.taskRepository.update(taskId, d);
    }
    public async updateTaskFollowUpDate(taskId: string, followUpDate: Date | undefined): Promise<T> {
        const d = { followUpDate };
        return this.taskRepository.update(taskId, d);
    }
    public async updateTaskTags(taskId: string, tags: string | undefined): Promise<T> {
        const d = { tags };
        return this.taskRepository.update(taskId, d);
    }
    public async updateTaskCategories(taskId: string, categories: string | undefined): Promise<T> {
        const d = { categories };
        return this.taskRepository.update(taskId, d);
    }
    public async taskCompleted(taskId: string): Promise<T> {
        const d = { completed: true, completedAt: new Date() };
        return this.taskRepository.update(taskId, d);
    }
    public async taskSeen(taskId: string): Promise<T> {
        const d = { seen: true, seenAt: new Date() };
        return this.taskRepository.update(taskId, d);
    }
}
