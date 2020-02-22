/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */

import { EventEmitter } from 'events';
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmnEngine } from './BpmnEngine';
import { BpmnProcessModel } from './BpmnProcessRepository';

import {
    BpmnVariables,
    BpmnLogger,
    BpmnService,
    BpmnEnvironment,
    BpmnProcessExecution,
    BpmnActivity,
    BpmnProcess,
    BpmnProcessExecutionState,
    BpmnFlow,
    BpmnExtensions,
    BpmnBroker,
    BpmnExecutionProcessState,
    BpmnEngineRuntime,
    BpmnEngineRuntimeState,
    BpmnEngineRuntimeStateType,
    BpmnEngineRuntimeOptions,
    BpmnDefinition,
    BpmnEngineRuntimeApi,
    OnMessageCallback,
    BpmnServices,
    BpmnApiExecutionContext,
    BpmnEngineRuntimeExecution,
    BpmnErrorEventType,
    BpmnFlowEventType,
    BpmnActivityEventType,
} from './definitions/bpmn-elements';

const { Engine } = require('bpmn-engine');

export interface BpmnProcessInstanceOptions extends BpmnEngineRuntimeOptions {
    name?: string;
    id?: string;
    definitionId?: string;
    definitionName?: string;
    definitionVersion?: number;
    source?: string;
}

export type BpmnProcessExecuteOptions = BpmnProcessInstanceOptions;

export type BpmnProcessRecoverOptions = BpmnProcessInstanceOptions;

export type BpmnProcessResumeOptions = BpmnProcessInstanceOptions;

export class BpmnProcessInstance {
    private processRuntime: BpmnEngineRuntime;
    private bpmnEngine: BpmnEngine;
    private eventEmitter: EventEmitter;
    private options?: BpmnProcessInstanceOptions;
    private execution!: BpmnEngineRuntimeExecution;
    private name: string;
    private id = uuidv1();
    private definitionId?: string;
    private definitionName?: string;
    private definitionVersion?: number;
    constructor(bpmnEngine: BpmnEngine, options?: BpmnProcessInstanceOptions) {
        const self = this;
        this.bpmnEngine = bpmnEngine;
        this.eventEmitter = new EventEmitter();
        this.options = options || { name: '', source: '' };
        this.id = this.options.id || this.id;
        this.definitionId = this.options.definitionId;
        this.definitionName = this.options.definitionName;
        this.definitionVersion = this.options.definitionVersion;
        this.options.name = this.options.name || this.definitionName || 'BpmnProcess-' + this.id;
        if (typeof this.options.name !== 'string') {
            throw new Error('BpmnProcess name must be string');
        }
        this.name = this.options.name;

        const internalElements = {};
        const internalExtentions: BpmnExtensions = {};
        const internalServices: BpmnServices = {};

        const internalModdles = BpmnProcessInstance.getDefaultModdles(bpmnEngine);
        this.options.moddleOptions = {
            ...internalModdles,
            ...this.options.moddleOptions,
        };
        // assign elements
        this.options.elements = { ...internalElements, ...this.options.elements };
        // assign services
        const services: BpmnServices = { ...internalServices, ...this.options.services };
        this.options.services = services;
        // assign extension
        const exts: BpmnExtensions = { ...internalExtentions, ...this.options.extensions };
        const extenstions = {};
        Object.entries(exts).forEach(ext => {
            extenstions[ext[0]] = ext[1](self);
        });
        this.options.extensions = extenstions;
        this.options = { listener: self.eventEmitter, ...this.options };
        this.processRuntime = Engine(this.options);
        this.name = this.processRuntime.name;
        this.emit('created', this);
    }

    public static getDefaultModdles(bpmnEngine: BpmnEngine) {
        return {
            nowjs: require('nowjs-bpmn-moddle/resources/nowjs.json'),
            // camunda: require("camunda-bpmn-moddle/resources/camunda.json"),
        };
    }

    public get BpmnEngine() {
        return this.bpmnEngine;
    }

    public get Id() {
        return this.id;
    }

    public get Options() {
        return { ...this.options };
    }

    public get Source() {
        return this.options?.source;
    }

    public get DefinitionId() {
        return this.definitionId;
    }
    public get DefinitionName() {
        return this.definitionName;
    }
    public get DefinitionVersion() {
        return this.definitionVersion;
    }

    public get Logger(): BpmnLogger {
        return this.processRuntime.logger;
    }

    public get Name(): string {
        return this.name;
    }

    public get Broker(): BpmnBroker {
        return this.processRuntime.broker;
    }

    public get State(): BpmnEngineRuntimeStateType {
        return this.processRuntime.state;
    }

    public get Environment(): BpmnEnvironment {
        return this.processRuntime.environment;
    }

    public get Stopped(): boolean {
        return this.processRuntime.stopped;
    }

    public get Execution(): BpmnEngineRuntimeExecution {
        return this.execution;
    }

    public async execute(options?: BpmnProcessExecuteOptions): Promise<BpmnEngineRuntimeApi> {
        const self = this;
        const p = new Promise<BpmnEngineRuntimeApi>(async (resolve, reject) => {
            try {
                if (self.execution) {
                    resolve(self.execution);
                    return;
                }
                const r = await self.processRuntime.execute<any>({
                    // listener: self.eventEmitter,
                    ...self.options,
                    ...options,
                });
                self.execution = r;
                resolve(r);
            } catch (error) {
                reject(error);
            }
        });
        return p;
    }

    public on<R>(
        eventName: BpmnErrorEventType,
        callback: (activity: BpmnActivity, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public on<R>(
        eventName: BpmnFlowEventType,
        callback: (activity: BpmnFlow, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public on<R>(
        eventName: BpmnActivityEventType,
        callback: (activity: BpmnActivity, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public on<R>(eventName: string, callback: (...args: any[]) => R): BpmnProcessInstance {
        this.eventEmitter.on(eventName, callback);
        return this;
    }

    public once<R>(
        eventName: BpmnErrorEventType,
        callback: (activity: BpmnActivity, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public once<R>(
        eventName: BpmnFlowEventType,
        callback: (activity: BpmnFlow, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public once<R>(
        eventName: BpmnActivityEventType,
        callback: (activity: BpmnActivity, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public once<R>(eventName: string, callback: (...args: any[]) => R): BpmnProcessInstance {
        this.eventEmitter.once(eventName, callback);
        return this;
    }

    public off<R>(
        eventName: BpmnErrorEventType,
        callback: (activity: BpmnActivity, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public off<R>(
        eventName: BpmnFlowEventType,
        callback: (activity: BpmnFlow, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public off<R>(
        eventName: BpmnActivityEventType,
        callback: (activity: BpmnActivity, processApi: BpmnProcess) => R,
    ): BpmnProcessInstance;
    public off<R>(eventName: string, callback: (...args: any[]) => R): BpmnProcessInstance {
        this.eventEmitter.off(eventName, callback);
        return this;
    }

    public onActivityWait(callback: (activity?: BpmnActivity, processApi?: BpmnProcess) => void) {
        this.on('activity.wait', callback);
    }

    public onEnd(callback: (payload?: any) => void) {
        this.processRuntime.once('end', callback);
    }

    public onError(callback: (error: Error) => void) {
        this.processRuntime.once('error', callback);
    }

    /**
     * Stop execution
     *
     * @returns {Promise<void>}
     * @memberof BpmnProcess
     */
    public async stop(): Promise<void> {
        return this.processRuntime.stop();
    }

    public destroy(): boolean {
        this.removeAllListeners();
        this.emit('destroyed');
        return true;
    }
    public listenerCount(type: string | symbol): number {
        return this.eventEmitter.listenerCount(type);
    }
    public getMaxListeners(): number {
        return this.eventEmitter.getMaxListeners();
    }
    private emit(event: string, ...args: any[]): void {
        // this.Broker..eventEmitter.emit(event, args );
        this.Broker.publish('event', 'engine.' + event, { type: event });
    }
    public eventNames(): (string | symbol)[] {
        return this.eventEmitter.eventNames();
    }
    private removeAllListeners(event?: string): this {
        this.eventEmitter.removeAllListeners(event);
        this.processRuntime.removeAllListeners(event);
        return this;
    }

    private removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
        this.eventEmitter.removeListener(event, listener);
        return this;
    }

    /**
     * Recover engine from state.
     *
     * @param {*} [savedState] engine state
     * @param {BpmnProcessRecoverOptions} [recoverOptions] optional object with options that will completely override the options passed to the engine at init
     * @returns {BpmnProcessInstance}
     * @memberof BpmnProcess
     */
    public recover(savedState: BpmnProcessModel, recoverOptions?: BpmnProcessRecoverOptions): BpmnProcessInstance {
        const self = this;
        this.processRuntime = this.processRuntime.recover(savedState.data, {
            // listener: self.eventEmitter,
            ...self.options,
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
    public async resume(options?: BpmnProcessResumeOptions): Promise<BpmnEngineRuntimeApi> {
        const self = this;
        const p = new Promise<BpmnEngineRuntimeApi>(async (resolve, reject) => {
            try {
                if (self.execution) {
                    resolve(self.execution);
                    return;
                }
                if (this.State === 'idle') {
                    const r = await self.processRuntime.execute<any>({
                        // listener: self.eventEmitter,
                        ...self.options,
                        ...options,
                    });
                    this.execution = r;
                    resolve(r);
                } else {
                    const r = await self.processRuntime.resume<any>({
                        // listener: self.eventEmitter,
                        ...self.options,
                        ...options,
                    });
                    this.execution = r;
                    resolve(r);
                }
            } catch (error) {
                reject(error);
            }
        });
        return p;
    }
    /**
     * Get all definitions
     *
     * @returns {Promise<BpmnDefinition>}
     * @memberof BpmnProcess
     */
    public async getDefinitions(): Promise<BpmnDefinition[]> {
        const p = new Promise<BpmnDefinition[]>(async (resolve, reject) => {
            try {
                const r = this.execution ? this.execution.definitions : await this.processRuntime.getDefinitions();
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
    public async getDefinitionById(id: string): Promise<BpmnDefinition | null> {
        const p = new Promise<BpmnDefinition | null>(async (resolve, reject) => {
            try {
                const r = this.execution
                    ? this.execution.definitions.filter(xx => xx.id === id)
                    : [await this.processRuntime.getDefinitionById(id)];
                if (r.length > 0) return resolve(null);
                resolve(r[0]);
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
    public async getState(): Promise<BpmnEngineRuntimeState> {
        const p = new Promise<BpmnEngineRuntimeState>(async (resolve, reject) => {
            try {
                const r = await this.processRuntime.getState();
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
    public async waitFor<T>(eventName: string, onMessage?: OnMessageCallback): Promise<T> {
        const p = new Promise<T>(async (resolve, reject) => {
            try {
                const r = await this.processRuntime.waitFor<T>(eventName, onMessage);
                resolve(r);
            } catch (error) {
                reject(error);
            }
        });
        return p;
    }
}
