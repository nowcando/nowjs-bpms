import * as bm from "bpmn-moddle";
import { EventEmitter } from "events";
import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmnEngine } from "./BpmnEngine";
// tslint:disable-next-line:no-var-requires
const { Engine } = require("bpmn-engine");
export interface BpmnProcessOptions {
  name?: string;
  source?: string;
  variables?: any;

  scripts?: any;

  listener?: EventEmitter;
  services?: any;

  elements?: any;

  typeResolver?: <R>(...elements: any) => R;
  moddleOptions?: any;

  extensions?: any;
}


export interface BpmnProcessExecutionEnvironment {
  output: any ;
  variables: any;

  services: any;
}
export interface BpmnProcessExecutionState {
      name: string;
      state: "idle"|"running"|"stopped"|"error";
      stopped: boolean;
      engineVersion: string;
      environment: BpmnProcessExecutionEnvironment;
      definitions: bm.BaseElement[];
}
export interface BpmnProcessExeuctionApi {

  environment: BpmnProcessExecutionEnvironment;
  getState(): BpmnProcessExecutionState;
}
// tslint:disable: no-empty-interface
export interface BpmnProcessExecuteOptions extends BpmnProcessOptions {}

export interface BpmnProcessRecoverOptions extends BpmnProcessOptions {}

export interface BpmnProcessResumeOptions extends BpmnProcessOptions {}

export class BpmnProcess extends EventEmitter {
  private pengine: any;
  private engine: BpmnEngine;
  private options?: BpmnProcessOptions;

  private id = uuidv1();
  constructor(engine: BpmnEngine, options?: BpmnProcessOptions) {
    super();
    this.engine = engine;
    this.options = options || { name: "BpmnProcess-" + this.id, source: "" };
    if (typeof this.options.name !== "string") {
      throw new Error("BpmnProcess name must be string");
    }
    const self = this;
    this.options = {listener: self, ...this.options};
    this.pengine = Engine(this.options);
  }

  public get BpmnEngine() {
    return this.engine;
  }

  public get Id() {
    return this.id;
  }

  public get Logger(): any {
    return this.pengine.logger;
  }

  public get Name(): string {
    return this.pengine.name;
  }

  public get Broker(): any {
    return this.pengine.broker;
  }

  public get State(): any {
    return this.pengine.state;
  }

  public get Environment(): any {
    return this.pengine.environment;
  }

  public get Stopped(): boolean {
    return this.pengine.stopped;
  }

  public get Execution(): any {
    return this.pengine.execution;
  }

  public async execute(options?: BpmnProcessExecuteOptions): Promise<any> {
    const p = new Promise<any>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.execute(options));
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }
  public async stop(): Promise<void> {
    const p = new Promise<void>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.stop());
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  public recover(
    savedState?: any,
    recoverOptions?: BpmnProcessRecoverOptions,
  ): BpmnProcess {
    this.pengine = this.pengine.recover(savedState, recoverOptions);
    return this;
  }

  public async resume(options?: BpmnProcessResumeOptions): Promise<any> {
    const p = new Promise<void>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.resume(options));
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  public async getDefinitions(
    executeOptions: BpmnProcessExecuteOptions,
  ): Promise<bm.Definitions> {
    const p = new Promise<bm.Definitions>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.getDefinitions(executeOptions));
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  public async getDefinitionById<R extends bm.BaseElement>(
    id: string,
  ): Promise<R> {
    const p = new Promise<R>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.getDefinitionById(id));
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  public async getState<S>(): Promise<S> {
    const p = new Promise<S>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.getState());
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }
  //   public loadDefinition(serializedContext, executeOptions: BpmnProcessExecuteOptions): any {}

  //   public async serializeSource(source): Promise<any> {}
  //   public async serializeModdleContext(moddleContext): Promise<any> {}

  //   public async getModdleContext(source): Promise<any> {}
  public async waitFor<T>(eventName: string): Promise<T> {
    const p = new Promise<T>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.waitFor(eventName));
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }
}
