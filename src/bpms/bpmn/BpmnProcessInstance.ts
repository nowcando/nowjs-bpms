/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as bm from 'bpmn-moddle';
import bent from 'bent';
import { EventEmitter } from 'events';
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmnEngine } from './BpmnEngine';
import { BusinessRuleTaskExtension } from './extensions/BusinessRuleTaskExtension';
import { HumanInvolvementExtension } from './extensions/HumanInvolvementExtension';
import { ServiceTaskExtension } from './extensions/ServiceTaskExtension';
import { BpmnProcessModel } from './BpmnProcessRepository';
import { SaveToEnvironmentOutputExtension } from './extensions/SaveToEnvironmentOutputExtension';
import { InputOutputExtension } from './extensions/InputOutputExtension';
import { ExecutionListenerExtension } from './extensions/ExecutionListenerExtension';
import { UserTaskExtension } from './extensions/UserTaskExtension';
import { DynamicViewResolverExtension } from './extensions/DynamicViewResolverExtension';
import { DynamicRouteResolverExtension } from './extensions/DynamicRouteResolverExtension';
import { ProcessExtension } from './extensions/ProcessExtension';
import { SaveToResultVariableExtension } from './extensions/SaveToResultVariableExtension';
import { FormDataResolverExtension } from './extensions/FormDataExtension';
import { BpmnApiVariables, BpmnLogger, BpmnApiService, BpmnEnvironmentApi, BpmnProcessExecution, BpmnActivity, BpmnProcessApi, BpmnProcessExecutionState } from './definitions/bpmn-elements';

const { Engine } = require('bpmn-engine');
const httpJsonApi = bent('json');
const httpStreamApi = bent('buffer');
const httpStringApi = bent('string');



// tslint:disable: max-line-length



// export interface BpmnProcessActivity extends EventEmitter {
//     id: string;
//     type: string;
//     name: string;

//     content: any;
//     attachedTo: any;

//     Behaviour: any;

//     behaviour: any;

//     broker: any;

//     counters: any;
//     environment: BpmnEnvironmentApi;
//     execution: any;
//     executionId: string;
//     extensions: any[];
//     logger: BpmnApiLogger;
//     inbound: any[];
//     isRunning: boolean;
//     isStart: boolean;
//     isSubProcess: boolean;

//     // logger: BpmnLogger;
//     outbound: any[];
//     parent?: BpmnProcessActivity;
//     status: any;
//     stopped: boolean;

//     activate(): void;

//     deactivate(): void;

//     discard(): void;

//     getApi(message?: any): BpmnProcessExeuctionApi;

//     getActivityById(id: string): BpmnProcessActivity;

//     getState(): any;

//     message(messageContent: any): void;
//     signal: (message?: any, options?: any) => void;
//     next(): void;

//     recover(state: any): void;

//     resume(): void;

//     run(runContent?: any): void;

//     stop(): void;

//     waitFor<R>(eventName: string): Promise<R>;
// }


export interface BpmnProcessInstanceOptions {
    name?: string;
    id?: string;
    definitionId?: string;
    definitionName?: string;
    definitionVersion?: number;
    source?: string;
    variables?: BpmnApiVariables;

    Logger?: BpmnLogger;

    scripts?: any;

    listener?: EventEmitter;
    // tslint:disable-next-line:ban-types
    services?: Record<string,BpmnApiService>;

    elements?: any;

    typeResolver?: <R>(...elements: any) => R;
    moddleOptions?: any;

    extensions?: any;
}
export type BpmnProcessExecuteOptions = BpmnProcessInstanceOptions;

export type BpmnProcessRecoverOptions = BpmnProcessInstanceOptions;

export type BpmnProcessResumeOptions = BpmnProcessInstanceOptions;

export class BpmnProcessInstance extends EventEmitter {
    private processEngine: any;
    private bpmnEngine: BpmnEngine;
    private options?: BpmnProcessInstanceOptions;

    private id = uuidv1();
    private definitionId?: string;
    private definitionName?: string;
    private definitionVersion?: number;
    constructor(bpmnEngine: BpmnEngine, options?: BpmnProcessInstanceOptions) {
        super();
        this.bpmnEngine = bpmnEngine;
        this.options = options || { name: '', source: '' };
        this.id = this.options.id || this.id;
        this.definitionId = this.options.definitionId;
        this.definitionName = this.options.definitionName;
        this.definitionVersion = this.options.definitionVersion;
        this.options.name = this.options.name || 'BpmnProcess-' + this.id;
        if (typeof this.options.name !== 'string') {
            throw new Error('BpmnProcess name must be string');
        }
        const self = this;
        const internalElements = {};

        const internalServices = {
            getGroups() {
                return function getGroupsService(executionContext, callback) {
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.IdentityService;
                        ids.getGroups().then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getUserOfEmployee(employeeIdOrName: string) {
                return function getManagerOfUserService(executionContext, callback) {
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.OrganizationService;
                        ids.getOrganizationEmployee(employeeIdOrName).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getEmployeeOfUser(userIdOrName: string) {
                return function getEmployeeOfUserService(executionContext, callback) {
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.OrganizationService;
                        ids.getOrganizationEmployee(userIdOrName).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getManagerOfUser(userIdOrName: string) {
                return function getManagerOfUserService(executionContext, callback) {
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.OrganizationService;
                        ids.getOrganizationEmployee(userIdOrName).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getCoWorkerOfUser(userIdOrName: string) {
                return function getCoWorkerOfUserService(executionContext, callback) {
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.OrganizationService;
                        ids.getOrganizationEmployee(userIdOrName).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getGroupsOfUser(userIdOrName: string) {
                return function getGroupsOfUserService(executionContext, callback) {
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.OrganizationService;
                        ids.getOrganizationEmployee(userIdOrName).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getUsersOfGroup(groupIdOrName: string) {
                return function getUsersOfGroupService(executionContext, callback) {
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.IdentityService;
                        ids.getGroupUsers(groupIdOrName).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getInitiatorUser() {
                return function getInitiatorUserService(executionContext, callback) {
                    const username = executionContext?.environment?.variables?.initiatorUsername;
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.IdentityService;
                        ids.getUserByUsername(username).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getUser() {
                return async function getUserService(executionContext) {
                    const username = executionContext?.environment?.variables?.user?.username;
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const ids = self.BpmnEngine.BpmsEngine.IdentityService;
                        return ids.getUserByUsername(username);
                    } else {
                        return null;
                    }
                };
            },
            httpJsonApi: httpJsonApi,
            httpStreamApi: httpStreamApi,
            httpStringApi: httpStringApi,
            httpRequestApi: (options: any = {}) => async (scope, callback) => {
                let result: any = null;
                const vs = scope?.environment?.variables;
                const apiBasePath = options?.basePath || vs?.api?.basePath;
                const apiPath = options?.path || vs?.api?.path;
                const apiMethod = options?.method || vs?.api?.method || 'GET';
                const apiHeaders = options?.headers || vs?.api?.headers || {};
                const apiVars = options?.variables || vs?.api?.variables;
                const apiResponseType = options?.apiResponseType || vs?.api?.responseType || 'json';
                try {
                    let s = '';
                    let apiPaths = '';
                    if (apiMethod === 'GET' && apiVars) {
                        for (const key in apiVars) {
                            if (apiVars.hasOwnProperty(key)) {
                                s = s + '&' + key + '=' + apiVars[key];
                            }
                        }
                        apiPaths = apiPath + '?' + s;
                    } else {
                        apiPaths = apiPath;
                    }
                    const hapi = bent(apiBasePath, apiMethod, apiResponseType, 200);
                    result = await hapi(apiPaths, apiVars, apiHeaders);
                } catch (err) {
                    return callback(null, err);
                }

                return callback(null, result);
            },
            // tslint:disable-next-line:no-shadowed-variable
            evaluateDecision<T>(options: { decisionId?: string; context?: any } = {}) {
                return function getEvaludateDecisionService(executionContext, callback) {
                    const { content } = executionContext;
                    const decisionId = options.decisionId || content?.decision?.decisionRef;
                    const dcontext = options.context || content?.decision?.decisionContext || {};
                    if (self.BpmnEngine && self.BpmnEngine.BpmsEngine) {
                        const dmn = self.BpmnEngine.BpmsEngine.DmnEngine;
                        dmn.evaluateDecision<T>(`${decisionId}`, dcontext)
                            .then(result => {
                                callback(null, result);
                            })
                            .catch(err => {
                                callback(err);
                            });
                    } else {
                        return callback(new Error(`BpmsEngine not defined`));
                    }
                };
            },
        };

        const internalExtentions = {
            // NowJsExtension: NowJsExtension(self),
            ProcessExtension: ProcessExtension(self),
            FormDataResolverExtension: FormDataResolverExtension(self),
            BusinessRuleTaskExtension: BusinessRuleTaskExtension(self),
            HumanInvolvementExtension: HumanInvolvementExtension(self),
            SaveToResultVariableExtension: SaveToResultVariableExtension(self),
            ServiceTaskExtension: ServiceTaskExtension(self),
            UserTaskExtension: UserTaskExtension(self),
            SaveToEnvironmentOutputExtension: SaveToEnvironmentOutputExtension(self),
            InputOutputExtension: InputOutputExtension(self),
            ExecutionListenerExtension: ExecutionListenerExtension(self),
            DynamicViewResolverExtension: DynamicViewResolverExtension(self),
            DynamicRouteResolverExtension: DynamicRouteResolverExtension(self),
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

    public get Environment(): BpmnEnvironmentApi {
        return this.processEngine.environment;
    }

    public get Stopped(): boolean {
        return this.processEngine.stopped;
    }

    public get Execution(): BpmnProcessExecution {
        return this.processEngine.execution;
    }

    public async execute(options?: BpmnProcessExecuteOptions): Promise<BpmnProcessExecution> {
        const self = this;
        const p = new Promise<BpmnProcessExecution>(async (resolve, reject) => {
            try {
                const r = await this.processEngine.execute({ listener: self, ...options });
                resolve(r);
            } catch (error) {
                reject(error);
            }
        });
        return p;
    }

    public onActivityWait(callback: (activity: BpmnActivity, processApi: BpmnProcessApi) => void) {
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
    public recover(savedState: BpmnProcessModel, recoverOptions?: BpmnProcessRecoverOptions): BpmnProcessInstance {
        const self = this;
        this.processEngine = this.processEngine.recover(savedState.data, {
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
    public async resume(options?: BpmnProcessResumeOptions): Promise<BpmnProcessExecution> {
        const self = this;
        const p = new Promise<BpmnProcessExecution>(async (resolve, reject) => {
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
