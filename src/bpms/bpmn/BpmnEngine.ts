import { uuidv1 } from "nowjs-core/lib/utils";
import { Stream } from "stream";
import { BpmnProcess, BpmnProcessOptions } from "./BpmnProcess";

export type BpmnSource = string | Stream;

export interface BpmnEngineOptions {
  name: string;
}
export class BpmnEngine {
  private definitionCache: { [name: string]: any } = {};
  private processCache: { [name: string]: BpmnProcess } = {};
  private id: string = uuidv1();
  private name: string;
  private options: BpmnEngineOptions;
  constructor(options?: BpmnEngineOptions) {
    this.options = options || { name: "BpmnEngine-" + this.id };
    this.name = this.options.name;
  }

  public get Id(): string {
    return this.id;
  }
  public get Name(): string {
    return this.name;
  }

  public static createEngine(options?: BpmnEngineOptions): BpmnEngine {
    return new BpmnEngine(options);
  }

  public async registerDefinitions(
    name: string,
    source: BpmnSource,
  ): Promise<boolean> {
    if (!this.definitionCache[name]) {
      this.definitionCache[name] = source;
    }
    return Promise.resolve(true);
  }
  public async createProcess(
    options?: BpmnProcessOptions,
  ): Promise<BpmnProcess> {
    const self = this;
    const p = new Promise<BpmnProcess>((resolve, reject) => {
      try {
        const proc = new BpmnProcess(self, options);
        this.processCache[proc.Name] = proc;
        resolve(proc);
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }
}
