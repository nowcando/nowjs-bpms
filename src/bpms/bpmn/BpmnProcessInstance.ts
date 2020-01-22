/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as bm from 'bpmn-moddle';
import { EventEmitter } from 'events';
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmnEngine } from './BpmnEngine';
import { BpmnProcessPersistedData } from './BpmnProcessRepository';
import BusinessRuleTask from './elements/BusinessRuleTask';
import { BusinessRuleTaskExtension } from './extensions/BusinessRuleTaskExtension';
import { HumanInvolvementExtension } from './extensions/HumanInvolvementExtension';
import { NowJsExtension } from './extensions/NowJsExtension';
import { ServiceTaskExtension } from './extensions/ServiceTaskExtension';

const { Engine } = require('bpmn-engine');

export interface BpmnLogger {
    debug(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
}

export interface BpmnExecution {
    definitions: BpmnProcessExecutionDefinition[];
    state: 'idle' | 'running';

    stopped: boolean;
    execute(executeOptions?: any): BpmnProcessExeuctionApi;
    getState<R>(): R;

    resume(resumeOptions?: any): void;

    stop(): void;

    environment: BpmnProcessExecutionEnvironment;
}

// tslint:disable: max-line-length
export interface BpmnProcessOptions {
    name?: string;
    id?: string;
    source?: string;
    variables?: any;

    Logger?: BpmnLogger;

    scripts?: any;

    listener?: EventEmitter;
    // tslint:disable-next-line:ban-types
    services?: { [name: string]: Function };

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

    clone(environment?: BpmnProcessExecutionEnvironment): BpmnProcessExecutionContext;
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

export interface BpmnProcessActivity extends EventEmitter {
    id: string;
    type: string;
    name: string;

    attachedTo: any;

    Behaviour: any;

    behaviour: any;

    broker: any;

    counters: any;
    environment: BpmnProcessExecutionEnvironment;
    execution: any;
    executionId: string;
    extensions: any[];
    logger: BpmnLogger;
    inbound: any[];
    isRunning: boolean;
    isStart: boolean;
    isSubProcess: boolean;

    // logger: BpmnLogger;
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
    signal: (message?: any, options?: any) => void;
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

    resolveExpression<R>(expression: any, message?: any, expressionFnContext?: any): R;

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
export interface BpmnProcessExecutionDefinition extends EventEmitter {
    state: 'pending' | 'running' | 'completed';
    run: (callback?: any) => void;
    resume: (callback?: any) => void;

    recover: (state?: any) => void;

    sendMessage: (message: any) => void;

    executionId: string;
    execution: any;
    getProcesses: () => any[];

    getExecutableProcesses: () => any[];
    getApi: <T>(message: any) => T;
    getElementById: (elementId: string) => any;
    getActivityById: (childId: string) => any;
    environment: BpmnProcessExecutionEnvironment;
    status: string;
    stopped: boolean;
    type: string;
    signal: (message: any) => void;
    broker: any;
    id: string;
    isRunning: boolean;
    name: string;
    logger: BpmnLogger;
    waitFor(name: string, fn: Function): void;
}
export interface BpmnProcessExecutionDefinitionState {
    state: 'pending' | 'running' | 'completed';
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
    state: 'idle' | 'running';
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
    state: 'running' | 'idle';
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
export type BpmnProcessExecuteOptions = BpmnProcessOptions;

export type BpmnProcessRecoverOptions = BpmnProcessOptions;

export type BpmnProcessResumeOptions = BpmnProcessOptions;

export class BpmnProcessInstance extends EventEmitter {
    private processEngine: any;
    private bpmnEngine: BpmnEngine;
    private options?: BpmnProcessOptions;

    private id = uuidv1();
    constructor(bpmnEngine: BpmnEngine, options?: BpmnProcessOptions) {
        super();
        this.bpmnEngine = bpmnEngine;
        this.options = options || { name: '', source: '' };
        this.id = this.options.id || this.id;
        this.options.name = this.options.name || 'BpmnProcess-' + this.id;
        if (typeof this.options.name !== 'string') {
            throw new Error('BpmnProcess name must be string');
        }
        const self = this;
        const internalElements = {
            BusinessRuleTask,
        };

        const internalServices = {
            getManagerOfUser(userIdOrName: string) {
                return function getManagerOfUserService(executionContext, callback) {
                    callback('mohammad');
                };
            },
            getCoWorkerOfUser(userIdOrName: string) {
                return function getCoWorkerOfUserService(executionContext, callback) {
                    callback('hamid');
                };
            },
            getInitiatorUser() {
                return function getInitiatorUserService(executionContext, callback) {
                    callback('ali');
                };
            },
            getCurrentUser() {
                return function getInitiatorUserService(executionContext, callback) {
                    callback('saeed');
                };
            },
            // tslint:disable-next-line:no-shadowed-variable
            evaluateDecision<T>(options: { name: string; decisionId: string; context: any }) {
                return function getEvaludateDecisionService(executionContext, callback) {
                    const { name, decisionId, context } = options;
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const dmn = self.BpmnEngine.BpmsEngine.DmnEngine;
                        dmn.evaluateDecision<T>(decisionId, name, context).then(result => {
                            callback(result);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
        };

        const internalExtentions = {
            NowJsExtension: NowJsExtension(self),
            BusinessRuleTaskExtension: BusinessRuleTaskExtension(self),
            HumanInvolvementExtension: HumanInvolvementExtension(self),
            ServiceTaskExtension: ServiceTaskExtension(self),
        };
        const internalModdles = {
            nowjs: require('nowjs-bpmn-moddle/resources/nowjs.json'),
            // camunda: require("camunda-bpmn-moddle/resources/camunda.json"),
        };
        this.options.moddleOptions = {
            ...internalModdles,
            ...this.options.moddleOptions,
        };
        this.options.services = { ...internalServices, ...this.options.services };
        this.options.elements = { ...internalElements, ...this.options.elements };
        this.options.extensions = { ...internalExtentions, ...this.options.extensions };
        this.options = { listener: self, ...this.options };
        this.processEngine = Engine(this.options);
    }

    public get BpmnEngine() {
        return this.bpmnEngine;
    }

    public get Id() {
        return this.id;
    }

    public get Logger(): BpmnLogger {
        return this.processEngine.logger;
    }

    public get Name(): string {
        return this.processEngine.name;
    }

    public get Broker(): any {
        return this.processEngine.broker;
    }

    public get State(): any {
        return this.processEngine.state;
    }

    public get Environment(): BpmnProcessExecutionEnvironment {
        return this.processEngine.environment;
    }

    public get Stopped(): boolean {
        return this.processEngine.stopped;
    }

    public get Execution(): BpmnExecution {
        return this.processEngine.execution;
    }

    public async execute<R extends BpmnExecution>(options?: BpmnProcessExecuteOptions): Promise<R> {
        const self = this;
        const p = new Promise<R>(async (resolve, reject) => {
            try {
                const r = await this.processEngine.execute(
                    { listener: self, ...options },
                    // (err: any, execution: any) => {
                    //   if (err) {
                    //     reject(err);
                    //   } else {
                    //     resolve(execution);
                    //   }
                    // },
                );
                resolve(r);
            } catch (error) {
                reject(error);
            }
        });
        return p;
    }

    public onActivityWait(callback: (activity: BpmnProcessActivity, processApi: any) => void) {
        this.on('activity.wait', callback);
    }

    public onEnd(callback: (payload?: any) => void) {
        this.processEngine.once('end', callback);
    }

    public onError(callback: (error: Error) => void) {
        this.processEngine.once('error', callback);
    }

    /**
     * Stop execution
     *
     * @returns {Promise<void>}
     * @memberof BpmnProcess
     */
    public async stop(): Promise<void> {
        return this.processEngine.stop();
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
        savedState: BpmnProcessPersistedData,
        recoverOptions?: BpmnProcessRecoverOptions,
    ): BpmnProcessInstance {
        const self = this;
        this.processEngine = this.processEngine.recover(JSON.parse(savedState.data), {
            listener: self,
            ...recoverOptions,
        });
        return this;
    }

    /**
     * Resume execution function with previously saved engine state.
     *
     * @param {BpmnProcessResumeOptions} [options]
     * @returns {Promise<any>}
     * @memberof BpmnProcess
     */
    public async resume(options?: BpmnProcessResumeOptions): Promise<BpmnExecution> {
        const self = this;
        const p = new Promise<BpmnExecution>(async (resolve, reject) => {
            try {
                const r = await this.processEngine.resume({
                    listener: self,
                    ...options,
                });
                if (r && r.definitions) {
                    for (const pdf of r.definitions) {
                        pdf.run();
                    }
                }
                resolve(r);
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
                const r = await this.processEngine.getDefinitions();
                resolve(r);
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
    public async getDefinitionById<R extends bm.BaseElement>(id: string): Promise<R> {
        const p = new Promise<R>(async (resolve, reject) => {
            try {
                const r = await this.processEngine.getDefinitionById(id);
                resolve(r);
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
                const r = await this.processEngine.getState();
                resolve(r);
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
                const r = await this.processEngine.waitFor(eventName);
                resolve(r);
            } catch (error) {
                reject(error);
            }
        });
        return p;
    }
}
