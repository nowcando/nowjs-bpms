import { uuidv1 } from "nowjs-core/lib/utils";

export interface Task {
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
  refTaskId?: string;
  createdAt?: Date;
  seenAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  followUpDate?: Date;
  tags?: string;
  categories?: string;
}

export interface TaskQueryFilter {
  [name: string]: string;
}

export interface TaskQuerySort {
  [name: string]: "asc" | "desc";
}
export interface TaskQuery {
  filter?: TaskQueryFilter;
  sort?: TaskQuerySort;
}

export interface TaskRepository<T extends Task = Task> {
  createTask(task: T): Promise<T>;
  removeTask(taskId: string): Promise<boolean>;

  findTask(taskId: string): Promise<T>;

  updateTaskDueDate(taskId: string, dueDate: Date | null): Promise<T>;
  updateTaskFollowUpDate(taskId: string, followUpDate: Date | null): Promise<T>;
  updateTaskTags(taskId: string, tags: string | null): Promise<T>;
  updateTaskCategories(taskId: string, categories: string | null): Promise<T>;
  findTasks(...taskId: string[]): Promise<T[]>;
  taskCompleted(taskId: string): Promise<T>;
  taskSeen(taskId: string): Promise<T>;
  countTasks(options?: TaskQueryFilter): Promise<number>;
  queryTasks(options?: TaskQuery): Promise<T[]>;
}

export class TaskMemoryRepository<T extends Task = Task>
  implements TaskRepository<T> {
  private tasks: T[] = [];
  public async createTask(task: T): Promise<T> {
    task.id = uuidv1();
    (task.createdAt = new Date()), this.tasks.push(task);
    return Promise.resolve(task);
  }
  public removeTask(taskId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public async findTask(taskId: string): Promise<T> {
    const t = this.tasks.find((xx) => xx.id === taskId);
    return t as any;
  }
  public async updateTaskDueDate(taskId: string, dueDate: Date | null): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public async updateTaskFollowUpDate(
    taskId: string,
    followUpDate: Date | null,
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public async updateTaskTags(taskId: string, tags: string | null): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public async updateTaskCategories(
    taskId: string,
    categories: string | null,
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public async findTasks(...taskId: string[]): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  public taskCompleted(taskId: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public taskSeen(taskId: string): Promise<T> {
    throw new Error("Method not implemented.");
  }
  public countTasks(options?: TaskQueryFilter | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
  public queryTasks(options?: TaskQuery | undefined): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
}
