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

  updateTaskDueDate(taskId: string, dueDate: Date | undefined): Promise<T>;
  updateTaskFollowUpDate(
    taskId: string,
    followUpDate: Date | undefined,
  ): Promise<T>;
  updateTaskTags(taskId: string, tags: string | undefined): Promise<T>;
  updateTaskCategories(
    taskId: string,
    categories: string | undefined,
  ): Promise<T>;
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
  public async removeTask(taskId: string): Promise<boolean> {
    const t = this.tasks.findIndex((xx) => xx.id === taskId);
    if (t >= 0) {
      this.tasks.splice(t, 1);
    }
    return t as any;
  }
  public async findTask(taskId: string): Promise<T> {
    const t = this.tasks.find((xx) => xx.id === taskId);
    return t as any;
  }
  public async updateTaskDueDate(
    taskId: string,
    dueDate: Date | undefined,
  ): Promise<T> {
    const t = this.tasks.find((xx) => xx.id === taskId);
    if (t) {
      t.updatedAt = new Date();
      t.dueDate = dueDate;
    }
    return t as any;
  }
  public async updateTaskFollowUpDate(
    taskId: string,
    followUpDate: Date | undefined,
  ): Promise<T> {
    const t = this.tasks.find((xx) => xx.id === taskId);
    if (t) {
      t.updatedAt = new Date();
      t.followUpDate = followUpDate;
    }
    return t as any;
  }
  public async updateTaskTags(
    taskId: string,
    tags: string | undefined,
  ): Promise<T> {
    const t = this.tasks.find((xx) => xx.id === taskId);
    if (t) {
      t.updatedAt = new Date();
      t.tags = tags;
    }
    return t as any;
  }
  public async updateTaskCategories(
    taskId: string,
    categories: string | undefined,
  ): Promise<T> {
    const t = this.tasks.find((xx) => xx.id === taskId);
    if (t) {
      t.updatedAt = new Date();
      t.categories = categories;
    }
    return t as any;
  }
  public async findTasks(...taskId: string[]): Promise<T[]> {
    const t = this.tasks.filter((xx) => taskId.includes(xx.id || ""));
    return t as any;
  }
  public async taskCompleted(taskId: string): Promise<T> {
    const t = this.tasks.find((xx) => xx.id === taskId);
    if (t) {
      t.completedAt = new Date();
      t.completed = true;
    }
    return t as any;
  }
  public async taskSeen(taskId: string): Promise<T> {
    const t = this.tasks.find((xx) => xx.id === taskId);
    if (t) {
      t.seenAt = new Date();
      t.seen = true;
    }
    return t as any;
  }
  public async countTasks(
    options?: TaskQueryFilter | undefined,
  ): Promise<number> {
    const t = this.tasks.length;
    return t as any;
  }
  public async queryTasks(options?: TaskQuery | undefined): Promise<T[]> {
    const t = this.tasks.slice();
    return t as any;
  }
}
