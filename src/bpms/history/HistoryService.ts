import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "../BpmsEngine";
import { TaskRepository } from "../task/TaskRepository";
import { HistoryData, HistoryMemoryRepository, HistoryRepository } from "./HistoryRepository";


export interface HistoryServiceOptions {
    historyRepository?: HistoryRepository;
    name: string;
}
export class HistoryService<T extends HistoryData = HistoryData> {

    private historyRepository: HistoryRepository<T>;
 private id: string =  uuidv1();
  private options: HistoryServiceOptions;
  constructor(private bpmsEngine?: BpmsEngine, options?: HistoryServiceOptions) {
      this.options =  options || {name: "HistoryService" + this.id};
      this.historyRepository = this.options.historyRepository ||  (new HistoryMemoryRepository() as any);
  }

  public static createService(options?: HistoryServiceOptions): HistoryService;
  public static createService(
    bpmsEngine?: BpmsEngine,
    options?: HistoryServiceOptions,
  ): HistoryService;
  public static createService(
    arg1?: BpmsEngine | HistoryServiceOptions,
    arg2?: HistoryServiceOptions,
  ): HistoryService {
    if (arg1 instanceof BpmsEngine) {
      return new HistoryService(arg1, arg2);
    }
    return new HistoryService(undefined, arg1);
  }
  public get HistoryRepository(): HistoryRepository<T> {
    return this.historyRepository;
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
    public async createEntry(data: T): Promise<T> {
        throw new Error("Method not implemented.");
    }
    public async removeEntry(entryId: string): Promise<boolean>;
    // tslint:disable:unified-signatures
    public async removeEntry(data: T): Promise<boolean>;
    public async removeEntry(arg1: T| string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public async findEntry(): Promise<T> {
        throw new Error("Method not implemented.");
    }
    public async findEntries(): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    public async count(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public async query(): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
}
