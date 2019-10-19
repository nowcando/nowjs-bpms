import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmsEngine } from "../BpmsEngine";
import {
  BpmnDefinitionMemoryRepository,
  BpmnDefinitionRepository,
} from "./BpmnDefinitionRepository";
import { BpmnProcessActivity, BpmnProcessInstance, BpmnProcessOptions } from "./BpmnProcessInstance";
import {
  BpmnProcessMemoryRepository,
  BpmnProcessRepository,
} from "./BpmnProcessRepository";
import BusinessRuleTask from "./elements/BusinessRuleTask";
// tslint:disable: no-var-requires
const { Engine } = require("bpmn-engine");
export type BpmnSource = string;

export interface BpmnEngineOptions {
  name: string;
  processRepository?: BpmnProcessRepository;
  definitionRepository?: BpmnDefinitionRepository;
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
  private processRepository: BpmnProcessRepository;
  private definitionRepository: BpmnDefinitionRepository;
  private options: BpmnEngineOptions;
  private bpmsEngine: BpmsEngine | undefined;
  constructor(options?: BpmnEngineOptions);
  constructor(bpmsEngine?: BpmsEngine, options?: BpmnEngineOptions);
  constructor(
    arg1?: BpmsEngine | BpmnEngineOptions,
    arg2?: BpmnEngineOptions,
  ) {
    if (arg1 instanceof BpmsEngine) {
      this.bpmsEngine = arg1;
      this.options = arg2 || { name: "BpmnEngine-" + this.id };
      this.name = this.options.name;
    } else {
      this.bpmsEngine = undefined;
      this.options = arg1 || { name: "BpmnEngine-" + this.id };
      this.name = this.options.name;
    }

    this.processRepository =
      this.options.processRepository || new BpmnProcessMemoryRepository();
    this.definitionRepository =
      this.options.definitionRepository ||
      new BpmnDefinitionMemoryRepository();
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

  public get ProcessRepository(): BpmnProcessRepository {
    return this.processRepository;
  }

  public get DefinitionPersistency(): BpmnDefinitionRepository {
    return this.definitionRepository;
  }
  public static createEngine(options?: BpmnEngineOptions): BpmnEngine;
  public static createEngine(
    bpmsEngine?: BpmsEngine,
    options?: BpmnEngineOptions,
  ): BpmnEngine;
  public static createEngine(
    arg1?: BpmsEngine | BpmnEngineOptions,
    arg2?: BpmnEngineOptions,
  ): BpmnEngine {
    if (arg1 instanceof BpmsEngine) {
      return new BpmnEngine(arg1, arg2);
    }
    return new BpmnEngine(undefined, arg1);
  }

  public async registerDefinitions(
    name: string,
    source: BpmnSource,
  ): Promise<boolean> {
    const self = this;
    const options = {
      name,
      source,
      elements: {BusinessRuleTask},
      moddleOptions: {nowjs: require("nowjs-bpmn-moddle/resources/nowjs.json")},
      extensions: {
        nowjs(element: any, definition: any) {
          if (element.type.toLowerCase() === "bpmn:Process".toLowerCase()) {
            if (
              element.behaviour &&
              element.behaviour.extensionElements &&
              element.behaviour.extensionElements.values
            ) {
              const elm = element.behaviour;
              if (self.BpmsEngine && elm.navigationEnabled && elm.navigationKey) {
                self.BpmsEngine.NavigationService.registerNavigations({
                  definitionName: name,
                  processName: element.name,
                  type: element.type,
                  key: elm.navigationKey,
                  title:  elm.navigationTitle || elm.title || elm.name,
                  enabled: elm.navigationEnabled,
                  authorization: elm.authorization,
                });
              }
              for (const extn of element.behaviour.extensionElements.values) {
                if (
                  extn.$type.toLowerCase() === "camunda:dynamicView".toLowerCase() ||
                  extn.$type.toLowerCase() === "nowjs:dynamicView".toLowerCase()
                ) {
                  const vscript = extn && extn.script && extn.script.value;
                  if (self.BpmsEngine && vscript) {
                    self.BpmsEngine.UIService.registerProcessViews(
                      name,
                      { name: extn.name || "default",
                        title: extn.title || extn.navigationTitle || extn.name,
                        navigationKey: extn.navigationKey,
                        navigationTitle:  extn.navigationTitle || extn.title || extn.name,
                        navigationEnabled: extn.navigationEnabled,
                        authorization: extn.authorization,
                        body: vscript },
                    );
                  }
                  if (self.BpmsEngine && extn.navigationEnabled && extn.navigationKey) {
                    self.BpmsEngine.NavigationService.registerNavigations({
                      definitionName: name,
                      processName: element.name,
                      type: element.type,
                      key: extn.navigationKey,
                      title:  extn.navigationTitle || extn.title || extn.name,
                      enabled: extn.navigationEnabled,
                      authorization: extn.authorization,
                    });
                  }
                }
              }
            }
            return true;
          } else { return false; }
        },
      },
    };
    const engine =  new Engine(options);
    const p = await engine.execute();
    p.stop();
    // const definitions =  await engine.getDefinitions();
    // if (definitions) {
    //   const processes = definitions.context.getProcesses();
    //   definitions.context.loadExtensions();
    // }
    this.definitionRepository.persist({ definitions: source, name });
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
          const d = await this.definitionRepository.find({
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
      //  proc.onActivityWait((a, b) => this.onProcessWaitActivity.call(this, proc, a, b));
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
    return this.definitionRepository.count();
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
        const plist = await this.processRepository.list({
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
        const plist = await this.processRepository.list();
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
          const r = await this.processRepository.persist({
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
              this.processRepository.persist({
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
