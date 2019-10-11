import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "../BpmsEngine";
import {
  Task,
  TaskMemoryRepository,
  TaskQuery,
  TaskQueryFilter,
  TaskRepository,
} from "./TaskRepository";

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

export interface TaskServiceOptions {
  taskRepository?: TaskRepository;
  name: string;
}
export class TaskService<T extends Task = Task> {
  private taskRepository: TaskRepository<T>;
  private id: string =  uuidv1();
  private options: TaskServiceOptions;
  constructor(private bpmsEngine?: BpmsEngine, options?: TaskServiceOptions) {
    this.options = options || {name: "TaskService" + this.id};
    this.taskRepository =
      this.options.taskRepository || (new TaskMemoryRepository<T>() as any);
  }

  public static createService(options?: TaskServiceOptions): TaskService;
  public static createService(
    bpmsEngine?: BpmsEngine,
    options?: TaskServiceOptions,
  ): TaskService;
  public static createService(
    arg1?: BpmsEngine | TaskServiceOptions,
    arg2?: TaskServiceOptions,
  ): TaskService {
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
  public get TaskRepository(): TaskRepository<T> {
    return this.taskRepository;
  }
  public get BpmsEngine(): BpmsEngine | undefined {
    return this.bpmsEngine;
  }
  public async createTask(task: T): Promise<T> {
    return this.taskRepository.createTask(task);
  }
  public async removeTask(taskId: string): Promise<boolean> {
    return this.taskRepository.removeTask(taskId);
  }

  public async findTask(taskId: string): Promise<T> {
    return this.taskRepository.findTask(taskId);
  }

  public async updateTaskDueDate(
    taskId: string,
    dueDate: Date | null,
  ): Promise<T> {
    return this.taskRepository.updateTaskDueDate(taskId, dueDate);
  }
  public async updateTaskFollowUpDate(
    taskId: string,
    followUpDate: Date | null,
  ): Promise<T> {
    return this.taskRepository.updateTaskFollowUpDate(taskId, followUpDate);
  }
  public async updateTaskTags(taskId: string, tags: string | null): Promise<T> {
    return this.taskRepository.updateTaskTags(taskId, tags);
  }
  public async updateTaskCategories(
    taskId: string,
    categories: string | null,
  ): Promise<T> {
    return this.taskRepository.updateTaskCategories(taskId, categories);
  }
  public async findTasks(...taskId: string[]): Promise<T[]> {
    return this.taskRepository.findTasks(...taskId);
  }
  public async taskCompleted(taskId: string): Promise<T> {
    return this.taskRepository.taskCompleted(taskId);
  }
  public async taskSeen(taskId: string): Promise<T> {
    return this.taskRepository.taskSeen(taskId);
  }
  public async countTasks(options?: TaskQueryFilter): Promise<number> {
    return this.taskRepository.countTasks(options);
  }
  public async queryTasks(options?: TaskQuery): Promise<T[]> {
    return this.taskRepository.queryTasks(options);
  }
}
