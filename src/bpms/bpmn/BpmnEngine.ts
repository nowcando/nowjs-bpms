import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "../BpmsEngine";
import {
  BpmnDefinitionMemoryPersistent,
  BpmnDefinitionPersistency,
} from "./BpmnDefinitionPersistency";
import { BpmnProcessInstance, BpmnProcessOptions } from "./BpmnProcessInstance";
import {
  BpmnProcessMemoryPersistent,
  BpmnProcessPersistency,
} from "./BpmnProcessPersistency";

export type BpmnSource = string;

export interface BpmnEngineOptions {
  name: string;
  processPersistency?: BpmnProcessPersistency;
  definitionPersistency?: BpmnDefinitionPersistency;
}

export interface BpmnEngineRecoverOptions {
  id?: string | string[];
  name?: string | string[];
  resume?: boolean;
}

export interface BpmnEnginePersistOptions {
  id?: string | string[];
  name?: string | string[];
  resume?: boolean;
}
export class BpmnEngine {
  private processCache: { [name: string]: BpmnProcessInstance } = {};
  private id: string = uuidv1();
  private name: string;
  private processPersistency: BpmnProcessPersistency;
  private definitionPersistency: BpmnDefinitionPersistency;
  private options: BpmnEngineOptions;
  constructor(private bpmsEngine?: BpmsEngine , options?: BpmnEngineOptions) {
    this.options = options || { name: "BpmnEngine-" + this.id };
    this.name = this.options.name;
    this.processPersistency =
      this.options.processPersistency || new BpmnProcessMemoryPersistent();
    this.definitionPersistency =
      this.options.definitionPersistency ||
      new BpmnDefinitionMemoryPersistent();
  }

  public get Id(): string {
    return this.id;
  }
  public get Name(): string {
    return this.name;
  }

  public get BpmsEngine(): BpmsEngine | undefined {
    return this.bpmsEngine;
  }


  public get ProcessPersistency(): BpmnProcessPersistency {
    return this.processPersistency;
  }

  public get DefinitionPersistency(): BpmnDefinitionPersistency {
    return this.definitionPersistency;
  }

  public static createEngine(bpmsEngine?: BpmsEngine, options?: BpmnEngineOptions): BpmnEngine {
    return new BpmnEngine(bpmsEngine, options);
  }

  public async registerDefinitions(
    name: string,
    source: BpmnSource,
  ): Promise<boolean> {
    this.definitionPersistency.persist({ definitions: source, name });
    return Promise.resolve(true);
  }
  public async createProcess(
    options?: BpmnProcessOptions,
  ): Promise<BpmnProcessInstance> {
    const self = this;
    const p = new Promise<BpmnProcessInstance>(async (resolve, reject) => {
      try {
        // using  registered definition if name already registered .
        if (options && options.name && !options.source) {
          const d = await this.definitionPersistency.find({
            name: options.name,
          });
          if (d) {
            options.source = d.definitions;
          }
        }
        const proc = new BpmnProcessInstance(self, options);
        this.processCache[proc.Id] = proc;
        proc.onEnd((e) => {
          delete this.processCache[proc.Id];
        });
        resolve(proc);
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  public async processCount(): Promise<number> {
    return Promise.resolve(Object.entries(this.processCache).length);
  }
  public async definitionCount(): Promise<number> {
    return this.definitionPersistency.count();
  }
  public async processList(): Promise<BpmnProcessInstance[]> {
    return Promise.resolve(Object.entries(this.processCache).map((xx) => xx[1]));
  }

  public async getProcessesByName(
    name: string,
  ): Promise<BpmnProcessInstance[] | null> {
    const x = Object.entries(this.processCache)
      .filter((xx) => xx[1].Name === name)
      .map((xx) => xx[1]);
    if (x) {
      return Promise.resolve(x);
    } else {
      return Promise.resolve(null);
    }
  }

  public async getProcessById(id: string): Promise<BpmnProcessInstance | null> {
    const x = Object.entries(this.processCache).find((xx) => xx[1].Id === id);
    if (x) {
      return Promise.resolve(x[1]);
    } else {
      return Promise.resolve(null);
    }
  }

  /**
   * Recover process state from persistency source
   *
   * @param {BpmnEngineRecoverOptions} [options]
   * @returns {Promise<boolean>}
   * @memberof BpmnEngine
   */
  public async recover(options?: BpmnEngineRecoverOptions): Promise<boolean> {
    try {
      if (options) {
        const plist = await this.processPersistency.list({
          id: options.id,
          name: options.name,
        });
        const clist = await this.processList();
        for (const pitem of plist) {
          if (!clist.some((xx) => xx.Id === pitem.id)) {
            const p = await this.createProcess({
              name: pitem.name,
              id: pitem.id,
            });
            p.recover(pitem);
            if (options.resume === true) {
              await p.resume();
            }
          }
        }
      } else {
        const plist = await this.processPersistency.list();
        const clist = await this.processList();
        for (const pitem of plist) {
          if (!clist.some((xx) => xx.Id === pitem.id)) {
            const p = await this.createProcess({
              name: pitem.name,
              id: pitem.id,
            });
            p.recover(pitem, { listener: p });
            await p.resume({ listener: p });
          }
        }
      }
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Persist process
   *
   * @param {BpmnEnginePersistOptions} [options]
   * @returns {Promise<boolean>}
   * @memberof BpmnEngine
   */
  public async persist(options?: BpmnEnginePersistOptions): Promise<boolean> {
    try {
      if (options) {
        const item = Object.entries(this.processCache).find(
          (xx) =>
            (options.id && options.id === xx[1].Id) ||
            options.name === xx[1].Name,
        );
        if (item) {
          const p = item[1];
          const d = await p.getState();
          const r = await this.processPersistency.persist({
            id: p.Id,
            name: p.Name,
            data: d,
          });
          return Promise.resolve(r);
        }
        return Promise.resolve(false);
      } else {
        const items = Object.entries(this.processCache);
        if (items) {
          const pr: Array<Promise<any>> = [];
          for (const item of items) {
            const p = item[1];
            const d = await p.getState();
            pr.push(
              this.processPersistency.persist({
                id: p.Id,
                name: p.Name,
                data: d,
              }),
            );
          }
          const r = await Promise.all(pr);
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Stop all processes
   *
   * @param {boolean} [persist=true] persist before stop all processes
   * @returns {Promise<void>}
   * @memberof BpmnEngine
   */
  public async stop(persist: boolean = true): Promise<void> {
    if (persist === true) {
      await this.persist();
    }
    const processes = await this.processList();
    for (const process of processes) {
      process.stop();
    }
    this.processCache = {};
    return Promise.resolve();
  }
}
