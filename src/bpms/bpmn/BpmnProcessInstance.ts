import * as bm from "bpmn-moddle";
import { EventEmitter } from "events";
import { uuidv1 } from "nowjs-core/lib/utils";
import { BpmnEngine } from "./BpmnEngine";
// tslint:disable-next-line:no-var-requires
const { Engine } = require("bpmn-engine");

export interface BpmnLogger {
  debug(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
}

export interface BpmnExecution {
  state: "idle" | "running";

  stopped: boolean;
  execute(executeOptions?: any): BpmnProcessExeuctionApi;
  getState<R>(): R;

  resume(resumeOptions?: any): void;

  environment: BpmnProcessExecutionEnvironment;

}

// tslint:disable: max-line-length
export interface BpmnProcessOptions {
  name?: string;
  source?: string;
  variables?: any;

  Logger?: BpmnLogger;

  scripts?: any;

  listener?: EventEmitter;
  services?: any;

  elements?: any;

  typeResolver?: <R>(...elements: any) => R;
  moddleOptions?: any;

  extensions?: any;
}

export interface BpmnProcess {
  new (processDefinition: any, context: BpmnProcessExecutionContext);
  id: string;
  type: string;
  name: string;
  isExecutable: boolean;
  broker: any;

  context: BpmnProcessExecutionContext;
  counters: any;
  environment: BpmnProcessExecutionEnvironment;
  execution: any;
  executionId: string;
  isRunning: boolean;

  logger: BpmnLogger;
  parent: BpmnProcess;
  status: any;

  stopped: boolean;

  getApi(message: any): BpmnProcessExeuctionApi;
  getActivities(): BpmnProcessActivity[];
  getActivityById(id: string): BpmnProcessActivity;

  getSequenceFlows(): any[];
  getPostponed(): BpmnProcessActivity[];

  getState(): any;

  recover(state: any): void;
  resume(): void;
  run(): void;
  stop(): void;
  waitFor<R>(eventName: string): Promise<R>;
}

export interface BpmnProcessExecutionContext {
  id: string;
  name: string;
  type: string;
  sid: any;
  definitionContext: any;
  environment: BpmnProcessExecutionEnvironment;

  clone(
    environment?: BpmnProcessExecutionEnvironment,
  ): BpmnProcessExecutionContext;
  getActivities(scopeId?: string): BpmnProcessActivity[];
  getActivityById(id): BpmnProcessActivity;
  getExecutableProcesses(): any[];
  getDataObjectById(id: string): any;

  getMessageFlows(): any[];

  getProcessById(id: string): any;

  getProcesses(): any;

  getSequenceFlowById(id: string): any;

  getSequenceFlows(scopeId: string): any[];

  getInboundSequenceFlows(activityId: string): any[];
  getOutboundSequenceFlows(activityId: string): any[];

  loadExtensions(activity: BpmnProcessActivity): void;
}

export interface BpmnProcessActivity {
  id: string;
  type: string;
  name: string;

  attachedTo: any;

  Behaviour: any;

  behaviour: any;

  broker: any;

  counters: any;
  environment: any;
  execution: any;
  executionId: string;
  extensions: any;

  inbound: any[];
  isRunning: boolean;
  isStart: boolean;
  isSubProcess: boolean;

  logger: BpmnLogger;
  outbound: any[];
  parent?: BpmnProcessActivity;
  status: any;
  stopped: boolean;

  activate(): void;

  deactivate(): void;

  discard(): void;

  getApi(message: any): BpmnProcessExeuctionApi;

  getActivityById(id: string): BpmnProcessActivity;

  getState(): any;

  message(messageContent: any): void;

  next(): void;

  recover(state: any): void;

  resume(): void;

  run(runContent?: any): void;

  stop(): void;

  waitFor<R>(eventName: string): Promise<R>;
}

export interface BpmnProcessExecutionEnvironment {
  options: any;
  extensions: any;

  scripts: any;
  output: any;
  variables: any;

  settings: any;

  Logger: BpmnLogger;
  services: any;
  // tslint:disable: ban-types
  addService(name: string, serviceFn: Function): void;
  assignVariables(...vars: any): void;
  clone(overrideOptions?: any): BpmnProcessExecutionEnvironment;
  getScript(scriptType: string, activity: any): any;
  getServiceByName(name: string): any;

  getState(): BpmnProcessExecutionState;

  registerScript(activity: any): void;

  resolveExpression<R>(
    expression: any,
    message?: any,
    expressionFnContext?: any,
  ): R;

  recover(state: any): void;
}
export interface BpmnExecutionEventMessageContent {
  id: string;
  type: string;
  executionId: string;
  parent?: BpmnExecutionEventMessageContent;
  path?: BpmnExecutionEventMessageContent[];
}
export interface BpmnExecutionEventMessageApi {
  id: string;
  type: string;
  name: string;
  executionId: string;
  environment: BpmnProcessExecutionEnvironment;
  fields: any;

  content: BpmnExecutionEventMessageContent;
  messageProperties: any;
  owner: any;

  cancel(): void;
  discard(): void;
  signal(message: string, options: any): void;
  stop(): void;

  resolveExpression<R>(expression: any): R;
  createMessage(overrideContent?: any): BpmnExecutionEventMessageApi;
}
export interface BpmnProcessExecutionDefinition {
  state: "pending" | "running" | "completed";
}
export interface BpmnProcessExecutionDefinitionState {
  state: "pending" | "running" | "completed";
  processes: {
    [processId: string]: {
      variables: any;
      services: any;
      children: BpmnProcessExecutionState[];
    };
  };
}
export interface BpmnProcessExecutionState {
  name: string;
  state: "idle" | "running";
  stopped: boolean;
  engineVersion: string;
  environment: BpmnProcessExecutionEnvironment;
  definitions: BpmnProcessExecutionDefinitionState[];

  entered: boolean;
}
export interface BpmnProcessExeuctionApi {
  /**
   * engine name
   *
   * @type {string}
   * @memberof BpmnProcessExeuctionApi
   */
  name: string;
  /**
   * state of execution, i.e running or idle
   *
   * @type {("running"| "idle")}
   * @memberof BpmnProcessExeuctionApi
   */
  state: "running" | "idle";
  /**
   * is the execution stopped
   *
   * @type {boolean}
   * @memberof BpmnProcessExeuctionApi
   */
  stopped: boolean;
  /**
   * engine environment
   *
   * @type {BpmnProcessExecutionEnvironment}
   * @memberof BpmnProcessExeuctionApi
   */
  environment: BpmnProcessExecutionEnvironment;

  /**
   * executing definitions
   *
   * @type {BpmnProcessExecutionDefinition}
   * @memberof BpmnProcessExeuctionApi
   */
  definitions: BpmnProcessExecutionDefinition;
  /**
   * get execution serializable state
   *
   * @returns {BpmnProcessExecutionState}
   * @memberof BpmnProcessExeuctionApi
   */
  getState(): BpmnProcessExecutionState;

  /**
   * stop execution
   *
   * @memberof BpmnProcessExeuctionApi
   */
  stop(): void;

  /**
   * get activities in a postponed state
   *
   * @memberof BpmnProcessExeuctionApi
   */
  getPostponed(): void;
}
// tslint:disable: no-empty-interface
export interface BpmnProcessExecuteOptions extends BpmnProcessOptions {}

export interface BpmnProcessRecoverOptions extends BpmnProcessOptions {}

export interface BpmnProcessResumeOptions extends BpmnProcessOptions {}

export class BpmnProcessInstance extends EventEmitter {
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
    this.options = { listener: self, ...this.options };
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

  public get Environment(): BpmnProcessExecutionEnvironment {
    return this.pengine.environment;
  }

  public get Stopped(): boolean {
    return this.pengine.stopped;
  }

  public get Execution(): BpmnExecution {
    return this.pengine.execution;
  }

  public async execute<R extends BpmnExecution>(options?: BpmnProcessExecuteOptions): Promise<R> {
    const p = new Promise<R>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.execute(options));
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  /**
   * Stop execution
   *
   * @returns {Promise<void>}
   * @memberof BpmnProcess
   */
  public async stop(): Promise<void> {
    const p = new Promise<void>(async (resolve, reject) => {
      try {
        resolve(this.pengine.stop());
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  /**
   * Recover engine from state.
   *
   * @param {*} [savedState] engine state
   * @param {BpmnProcessRecoverOptions} [recoverOptions] optional object with options that will completely override the options passed to the engine at init
   * @returns {BpmnProcessInstance}
   * @memberof BpmnProcess
   */
  public recover(
    savedState?: any,
    recoverOptions?: BpmnProcessRecoverOptions,
  ): BpmnProcessInstance {
    this.pengine = this.pengine.recover(savedState, recoverOptions);
    return this;
  }

  /**
   * Resume execution function with previously saved engine state.
   *
   * @param {BpmnProcessResumeOptions} [options]
   * @returns {Promise<any>}
   * @memberof BpmnProcess
   */
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
  /**
   * Get all definitions
   *
   * @returns {Promise<bm.Definitions>}
   * @memberof BpmnProcess
   */
  public async getDefinitions(): Promise<bm.Definitions> {
    const p = new Promise<bm.Definitions>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.getDefinitions());
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  /**
   * Get definition by id, returns Promise
   *
   * @template R definition
   * @param {string} id
   * @returns {Promise<R>}
   * @memberof BpmnProcess
   */
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

  /**
   * Get state of a running execution. Listener events wait and start are recommended when saving state.
   *
   * @template S
   * @returns {Promise<S>}
   * @memberof BpmnProcess
   */
  public async getState<S extends BpmnProcessExecutionState>(): Promise<S> {
    const p = new Promise<S>(async (resolve, reject) => {
      try {
        resolve(await this.pengine.getState());
      } catch (error) {
        reject(error);
      }
    });
    return p;
  }

  /**
   * wait for engine events, returns Promise
   *
   * @template T
   * @param {string} eventName event name
   * @returns {Promise<T>}
   * @memberof BpmnProcess
   */
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
