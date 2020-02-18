/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import { uuidv1 } from 'nowjs-core/lib/utils';
import bent from 'bent';
import { BpmsEngine } from '../BpmsEngine';
import {
    BpmnDefinitionMemoryRepository,
    BpmnDefinitionRepository,
    BpmnDefinitionModel,
} from './BpmnDefinitionRepository';
import { BpmnProcessInstance, BpmnProcessInstanceOptions } from './BpmnProcessInstance';
import { BpmnProcessMemoryRepository, BpmnProcessRepository } from './BpmnProcessRepository';
import {
    IdExpression,
    FilterExpression,
    BpmsBaseMemoryRepository,
    QueryOptions,
    ScalarOptions,
    QueryResult,
} from '../data/Repository';
import {
    BpmnEngineRuntimeState,
    BpmnEngineRuntimeApi,
    BpmnDefinition,
    BpmnExtensions,
    BpmnExtentionApi,
    BpmnExtension,
    BpmnServices,
    BpmnService,
} from './definitions/bpmn-elements';
import { BpmnDefinitionInstance } from './BpmnDefinitionInstance';
import { ProcessExtension } from './extensions/ProcessExtension';
import { ProcessHistoryExtension } from './extensions/ProcessHistoryExtension';
import { FormDataResolverExtension } from './extensions/FormDataExtension';
import { BusinessRuleTaskExtension } from './extensions/BusinessRuleTaskExtension';
import { HumanInvolvementExtension } from './extensions/HumanInvolvementExtension';
import { SaveToResultVariableExtension } from './extensions/SaveToResultVariableExtension';
import { ServiceTaskExtension } from './extensions/ServiceTaskExtension';
import { UserTaskExtension } from './extensions/UserTaskExtension';
import { SaveToEnvironmentOutputExtension } from './extensions/SaveToEnvironmentOutputExtension';
import { InputOutputExtension } from './extensions/InputOutputExtension';
import { ExecutionListenerExtension } from './extensions/ExecutionListenerExtension';
import { DynamicViewResolverExtension } from './extensions/DynamicViewResolverExtension';
import { DynamicRouteResolverExtension } from './extensions/DynamicRouteResolverExtension';

const httpJsonApi = bent('json');
const httpStreamApi = bent('buffer');
const httpStringApi = bent('string');
export type BpmnSource = string;

export interface BpmnEngineOptions {
    name: string;
    processRepository?: BpmnProcessRepository;
    bpmnDefinitionRepository?: BpmnDefinitionRepository;
}

export interface BpmnEngineRecoverOptions {
    filter?: FilterExpression;
    source?: string;
    resume?: boolean;
}

export interface BpmnEnginePersistOptions {
    filter?: FilterExpression;
    resume?: boolean;
}

export interface BpmsBpmnDefinition {
    id?: string;
    name: string;
    definitions: any;

    version: number;

    createdAt?: Date;
}

export interface BpmsProcess {
    id?: string;
    definitionId?: string;
    name: string;
    state: string;
    stopped: boolean;
    createdAt?: Date;
    persistedAt?: Date;
    data: any;
    isLoaded?: boolean;
}

export interface BpmnDefinitionLoadOptions {
    filter?: FilterExpression;
}

export class BpmnEngine {
    private loadedProcessRepository: BpmsBaseMemoryRepository<BpmnProcessInstance>; // { [name: string]: BpmnProcessInstance } = {};
    private id: string = uuidv1();
    private name: string;
    private processRepository: BpmnProcessRepository;
    private bpmnDefinitionRepository: BpmnDefinitionRepository;
    private options: BpmnEngineOptions;
    private bpmsEngine: BpmsEngine | undefined;
    constructor(options?: BpmnEngineOptions);
    constructor(bpmsEngine?: BpmsEngine, options?: BpmnEngineOptions);
    constructor(arg1?: BpmsEngine | BpmnEngineOptions, options?: BpmnEngineOptions) {
        if (arg1 instanceof BpmsEngine) {
            this.bpmsEngine = arg1;
            this.options = options || { name: 'BpmnEngine-' + this.id };
            this.name = this.options.name;
        } else {
            this.bpmsEngine = undefined;
            this.options = arg1 || { name: 'BpmnEngine-' + this.id };
            this.name = this.options.name;
        }
        this.loadedProcessRepository = new BpmsBaseMemoryRepository({
            storageName: 'LoadedProcess',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
        this.processRepository = this.options.processRepository || new BpmnProcessMemoryRepository();
        this.bpmnDefinitionRepository = this.options.bpmnDefinitionRepository || new BpmnDefinitionMemoryRepository();
        this.processExtensions = BpmnEngine.getDefaultExtensions();
        this.processServices = BpmnEngine.getDefaultBpmnServices(this);
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

    // public get ProcessRepository(): BpmnProcessRepository {
    //   return this.processRepository;
    // }

    // public get DefinitionPersistency(): BpmnDefinitionRepository {
    //   return this.definitionRepository;
    // }
    public static createEngine(options?: BpmnEngineOptions): BpmnEngine;
    public static createEngine(bpmsEngine?: BpmsEngine, options?: BpmnEngineOptions): BpmnEngine;
    public static createEngine(arg1?: BpmsEngine | BpmnEngineOptions, arg2?: BpmnEngineOptions): BpmnEngine {
        if (arg1 instanceof BpmsEngine) {
            return new BpmnEngine(arg1, arg2);
        }
        return new BpmnEngine(undefined, arg1);
    }
    private processExtensions: BpmnExtensions = {};
    private processServices: BpmnServices = {};
    public registerProcessExtension(name: string, extension: BpmnExtension): this {
        this.processExtensions[name] = extension;
        return this;
    }
    public removeProcessExtension(name: string): this {
        delete this.processExtensions[name];
        return this;
    }

    public registerProcessService(name: string, service: BpmnService): this {
        this.processServices[name] = service;
        return this;
    }
    public removeProcessService(name: string): this {
        delete this.processServices[name];
        return this;
    }

    public get ProcessExtensions(): BpmnExtensions {
        return { ...this.processExtensions };
    }

    public get ProcessServices(): BpmnServices {
        return { ...this.processServices };
    }

    public async createDefinitions(name: string, source: BpmnSource): Promise<BpmsBpmnDefinition> {
        const self = this;
        if (!name) {
            throw new Error(`The BPMN definition name ${name} required`);
        }
        if (!source) {
            throw new Error(`The BPMN definition source ${source} required`);
        }
        const f = await this.bpmnDefinitionRepository.find({ name });
        if (!f) {
            const r = await this.bpmnDefinitionRepository.create({ definitions: source, name, version: 1 });
            const p = {
                source: r.definitions,
                definitionId: r.id,
                definitionName: r.name,
                definitionVersion: r.version,
            };
            // await this.loadDefinition(p); // load definition
            this.bpmsEngine?.HistoryService.create({
                type: 'info',
                source: this.name,
                message: `The process definition has been created`,
                data: {
                    definitionId: r.id,
                    definitionName: r.name,
                    definitionVersion: r.version,
                    definitions: r.definitions,
                    method: 'createDefinitions',
                },
                eventId: 10081,
            });
            return r;
        }
        throw new Error('The bpmn definition already exists');
    }

    public async updateDefinitions(id: string, source: BpmnSource): Promise<BpmsBpmnDefinition> {
        const self = this;
        if (!id) {
            throw new Error(`The BPMN definition id ${id} required`);
        }
        if (!source) {
            throw new Error(`The BPMN definition source ${source} required`);
        }
        const f = await this.bpmnDefinitionRepository.find({ id });
        if (f) {
            const r = await this.bpmnDefinitionRepository.update(id, {
                ...f,
                definitions: source,
                id,
                version: f.version ? f.version + 1 : 1,
            });
            const p = {
                source: r.definitions,
                definitionId: r.id,
                definitionName: r.name,
                definitionVersion: r.version,
            };
            //  await this.loadDefinition(p); // load definition
            this.bpmsEngine?.HistoryService.create({
                type: 'info',
                source: this.name,
                message: `The process definition has been updated`,
                data: {
                    definitionId: r.id,
                    definitionName: r.name,
                    definitionVersion: r.version,
                    definitions: r.definitions,
                    method: 'updateDefinition',
                },
                eventId: 10079,
            });
            return r;
        }
        throw new Error(`The BPMN definition id ${id} not exists`);
    }

    public async countDefinitions(): Promise<number> {
        return this.bpmnDefinitionRepository.count();
    }

    public async findDefinition<R extends BpmsBpmnDefinition = BpmsBpmnDefinition>(id: IdExpression): Promise<R | null>;
    public async findDefinition<R extends BpmsBpmnDefinition = BpmsBpmnDefinition>(
        filter: FilterExpression,
    ): Promise<R | null>;
    public async findDefinition<R extends BpmsBpmnDefinition = BpmsBpmnDefinition>(expression: any): Promise<R | null> {
        return this.bpmnDefinitionRepository.find<R>(expression);
    }

    public async findProcess<R extends BpmsProcess = BpmsProcess>(id: IdExpression): Promise<R | null>;
    public async findProcess<R extends BpmsProcess = BpmsProcess>(filter: FilterExpression): Promise<R | null>;
    public async findProcess<R extends BpmsProcess = BpmsProcess>(expression: any): Promise<R | null> {
        const f = await this.processRepository.find<R>(expression);
        if (f && f.id) {
            const d = await this.loadedProcessRepository.find(f.id);
            f.isLoaded = d ? true : false;
        }
        return f;
    }

    public async loadDefinitions<R extends BpmsBpmnDefinition = BpmsBpmnDefinition>(
        options: BpmnDefinitionLoadOptions,
    ): Promise<R[]> {
        const self = this;
        const filter = options.filter;
        const df = await this.bpmnDefinitionRepository.findAll<R>(filter);
        for (const item of df) {
            const p: any = {
                source: item.definitions,
                definitionId: item.id,
                definitionName: item.name,
                definitionVersion: item.version,
            };
            this.loadDefinition(p);
        }
        return df;
    }

    public async loadDefinition(definition: {
        source: string;
        definitionId: string;
        definitionName: string;
        definitionVersion: number;
    }): Promise<BpmnDefinition> {
        const d = new BpmnDefinitionInstance(this, definition);
        const r = await d.run();
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.name,
            message: `The process definition has been loaded`,
            data: {
                definitionId: d.DefinitionId,
                definitionName: d.DefinitionName,
                definitionVersion: d.DefinitionVersion,
                method: 'loadDefinition',
            },
            eventId: 10076,
        });
        return r;
    }

    public async removeDefinition(id: IdExpression): Promise<boolean> {
        const r = this.bpmnDefinitionRepository.delete(id);
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.name,
            message: `The process definition has been removed`,
            data: {
                definitionId: id,
                method: 'removeDefinition',
            },
            eventId: 10073,
        });
        return r;
    }

    public async listDefinitions<R extends BpmsBpmnDefinition>(filter?: FilterExpression): Promise<R[]> {
        return this.bpmnDefinitionRepository.findAll<R>(filter);
    }

    public async clearDefinitions(): Promise<void> {
        await this.bpmnDefinitionRepository.deleteAll();
        this.bpmsEngine?.HistoryService.create({
            type: 'info',
            source: this.name,
            message: `The all process definition has been cleared`,
            data: {
                method: 'clearDefinitions',
            },
            eventId: 10071,
        });
        return;
    }

    public async listProcess<R extends BpmsProcess>(filter?: FilterExpression): Promise<R[]> {
        const l = await this.processRepository.findAll<R>(filter);
        for (const item of l) {
            const d = item.id && (await this.loadedProcessRepository.find(item.id));
            item.isLoaded = d ? true : false;
        }
        return l;
    }

    public async createProcess(options?: BpmnProcessInstanceOptions): Promise<BpmnProcessInstance> {
        const self = this;
        const p = new Promise<BpmnProcessInstance>(async (resolve, reject) => {
            try {
                // using  registered definition if name already registered .
                options = options || {};
                if (options && !options.source) {
                    let d: BpmnDefinitionModel | null;
                    if (options.definitionId) {
                        d = await this.bpmnDefinitionRepository.find({
                            id: options.definitionId,
                        });
                    } else if (options.definitionName) {
                        d = await this.bpmnDefinitionRepository.find({
                            name: options.definitionName,
                            version: options.definitionVersion,
                        });
                    } else {
                        d = await this.bpmnDefinitionRepository.find({
                            name: options.name,
                        });
                    }

                    if (d) {
                        options.definitionId = d.id;
                        options.definitionName = d.name;
                        options.definitionVersion = d.version;
                        options.source = d.definitions;
                    }
                }
                options.extensions = this.processExtensions;
                options.services = this.processServices;
                const proc = new BpmnProcessInstance(self, options);
                await this.loadedProcessRepository.update(proc.Id, proc, true);
                await this.persistProcess({ filter: { id: proc.Id } });
                this.bpmsEngine?.HistoryService.create({
                    type: 'info',
                    source: this.name,
                    message: `The process has been created`,
                    data: {
                        definitionId: options?.definitionId,
                        processId: proc.Id,
                        method: 'createProcess',
                    },
                    eventId: 10032,
                });
                proc.onEnd(async () => {
                    await this.loadedProcessRepository.delete(proc.Id);
                    const d = { terminatedAt: new Date(), terminated: true, terminateId: 1 };
                    await this.processRepository.update(proc.Id, d, true);
                    this.bpmsEngine?.HistoryService.create({
                        type: 'info',
                        source: this.name,
                        message: `The process has been terminated`,
                        data: {
                            definitionId: proc?.DefinitionId,
                            processId: proc.Id,
                        },
                        eventId: 10034,
                    });
                });
                resolve(proc);
            } catch (error) {
                reject(error);
            }
        });
        return p;
    }
    public async loadedProcessCount(): Promise<number> {
        return this.loadedProcessRepository.count();
    }
    public async persistedDefinitionCount(): Promise<number> {
        return this.bpmnDefinitionRepository.count();
    }

    public async persistedProcessCount(): Promise<number> {
        return this.processRepository.count();
    }

    public async listLoadedProcess(filter?: FilterExpression): Promise<BpmnProcessInstance[]> {
        return this.loadedProcessRepository.findAll(filter);
    }

    public async getProcess(id: IdExpression): Promise<BpmnProcessInstance | null> {
        const lp = await this.loadedProcessRepository.find(id);
        if (!lp) {
            const p = await this.processRepository.find(id);
            if (p) {
                const rp = await this.recoverProcesses({ filter: { id: id } });
                if (rp.length > 0) {
                    return rp[0];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return lp;
        }
    }

    public async getProcesses(filter: FilterExpression): Promise<BpmnProcessInstance[]> {
        const lp = await this.loadedProcessRepository.findAll(filter);
        if (!lp || lp.length === 0) {
            const rp = await this.recoverProcesses({ filter: filter });
            return rp;
        } else {
            return lp;
        }
    }

    public async recoverProcess(
        id: IdExpression,
        source?: string,
        resume?: boolean,
    ): Promise<BpmnProcessInstance | null> {
        const p = await this.recoverProcesses({ filter: { id }, resume, source });
        return p && p.length > 0 ? p[0] : null;
    }

    /**
     * Recover process state from persistency source
     *
     * @param {BpmnEngineRecoverOptions} [options]
     * @returns {Promise<boolean>}
     * @memberof BpmnEngine
     */
    public async recoverProcesses(options?: BpmnEngineRecoverOptions): Promise<BpmnProcessInstance[]> {
        const r: BpmnProcessInstance[] = [];
        try {
            const plist = await this.processRepository.findAll(options?.filter);
            for (const pitem of plist) {
                const lp = await this.loadedProcessRepository.find(pitem.id);
                if (!lp) {
                    let s = options?.source;
                    if (!s && pitem.definitionId) {
                        const df = await this.bpmnDefinitionRepository.find({
                            id: pitem.definitionId,
                            version: pitem.definitionVersion,
                        });
                        if (df) {
                            s = df.definitions;
                        }
                    }
                    const p = await this.createProcess({
                        name: pitem.name,
                        definitionId: pitem.definitionId,
                        definitionName: pitem.definitionName,
                        definitionVersion: pitem.definitionVersion,
                        source: s,
                        id: pitem.id,
                    });
                    p.recover(pitem);
                    if (options?.resume === true) {
                        await p.resume();
                    }
                    this.bpmsEngine?.HistoryService.create({
                        type: 'info',
                        source: this.name,
                        message: `The process has been recovered`,
                        data: {
                            definitionId: p?.DefinitionId,
                            processId: p.Id,
                            method: 'recoverProcesses',
                            from: 'persisted',
                        },
                        eventId: 10038,
                    });
                    r.push(p);
                } else {
                    lp.recover(pitem);
                    if (options?.resume === true) {
                        await lp.resume();
                    }
                    this.bpmsEngine?.HistoryService.create({
                        type: 'info',
                        source: this.name,
                        message: `The process has been recovered`,
                        data: {
                            definitionId: lp?.DefinitionId,
                            processId: lp.Id,
                            method: 'recoverProcesses',
                            from: 'loaded',
                        },
                        eventId: 10039,
                    });
                    r.push(lp);
                }
            }

            return r;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Persist process
     *
     * @param {BpmnEnginePersistOptions} [options]
     * @returns {Promise<boolean>}
     * @memberof BpmnEngine
     */
    public async persistProcess(options?: BpmnEnginePersistOptions): Promise<boolean> {
        try {
            if (options) {
                const item = options.filter && (await this.loadedProcessRepository.find(options && options.filter));
                if (item) {
                    const p = item;
                    const d = await p.getState();
                    const r = await this.processRepository.update(
                        p.Id,
                        {
                            id: p.Id,
                            name: p.Name,
                            state: p.State,
                            stopped: p.Stopped,
                            definitionId: p.DefinitionId,
                            definitionName: p.DefinitionName,
                            definitionVersion: p.DefinitionVersion,
                            persistedAt: new Date(),
                            data: d,
                        },
                        true,
                    );
                    this.bpmsEngine?.HistoryService.create({
                        type: 'info',
                        source: this.name,
                        message: `The process has been persisted`,
                        data: {
                            definitionId: p?.DefinitionId,
                            processId: p.Id,
                            method: 'persistProcess',
                        },
                        eventId: 10040,
                    });
                    return Promise.resolve(r !== null);
                }
                return Promise.resolve(false);
            } else {
                const f: any = options && (options as any).filter;
                const items = await this.loadedProcessRepository.findAll(f);
                if (items) {
                    const pr: Array<Promise<any>> = [];
                    for (const item of items) {
                        const p = item;
                        const d = await p.getState();
                        const m = this.processRepository.update(
                            p.Id,
                            {
                                id: p.Id,
                                name: p.Name,
                                state: p.State,
                                stopped: p.Stopped,
                                definitionId: p.DefinitionId,
                                definitionName: p.DefinitionName,
                                definitionVersion: p.DefinitionVersion,
                                persistedAt: new Date(),
                                data: d,
                            },
                            true,
                        );
                        this.bpmsEngine?.HistoryService.create({
                            type: 'info',
                            source: this.name,
                            message: `The process has been persisted`,
                            data: {
                                definitionId: p?.DefinitionId,
                                processId: p.Id,
                                method: 'persistProcess',
                            },
                            eventId: 10040,
                        });
                        pr.push(m);
                    }
                    const rs = await Promise.all(pr);
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
    public async stopProcesses(persist = true, filter?: FilterExpression): Promise<void> {
        if (persist === true) {
            await this.persistProcess({ filter });
        }
        const processes = await this.listLoadedProcess(filter);
        for (const process of processes) {
            process.stop();
            process.destroy();
            this.bpmsEngine?.HistoryService.create({
                type: 'info',
                source: this.name,
                message: `The process has been stopped`,
                data: {
                    definitionId: process?.DefinitionId,
                    processId: process.Id,
                    method: 'stopProcesses',
                },
                eventId: 10041,
            });
        }
        await this.loadedProcessRepository.deleteAll();
        return Promise.resolve();
    }

    public async stopProcess(id: IdExpression, persist = true): Promise<void> {
        const proc = await this.loadedProcessRepository.find(id);
        if (!proc) return;
        if (persist === true) {
            await this.persistProcess({ filter: { id: id } });
        }
        if (proc) {
            await proc.stop();
            proc.destroy();
            await this.loadedProcessRepository.delete(proc.Id);
            this.bpmsEngine?.HistoryService.create({
                type: 'info',
                source: this.name,
                message: `The process has been stopped`,
                data: {
                    definitionId: proc?.DefinitionId,
                    processId: proc.Id,
                    method: 'stopProcess',
                },
                eventId: 10041,
            });
        }

        return Promise.resolve();
    }

    public async getProcessState(id: IdExpression): Promise<BpmnEngineRuntimeState | null> {
        const proc = await this.loadedProcessRepository.find(id);
        if (proc) {
            const r = await proc.getState();
            this.bpmsEngine?.HistoryService.create({
                type: 'debug',
                source: this.name,
                message: `The process has been getState`,
                data: {
                    definitionId: proc?.DefinitionId,
                    processId: proc.Id,
                    method: 'getState',
                },
                eventId: 10048,
            });
            return r;
        }
        return Promise.resolve(null);
    }

    public async executeProcess(
        id: IdExpression,
        options?: BpmnProcessInstanceOptions,
    ): Promise<BpmnEngineRuntimeApi | null> {
        const proc = await this.loadedProcessRepository.find(id);
        if (proc) {
            const r = await proc.execute(options);
            this.bpmsEngine?.HistoryService.create({
                type: 'info',
                source: this.name,
                message: `The process has been execute`,
                data: {
                    definitionId: proc?.DefinitionId,
                    processId: proc.Id,
                    method: 'executeProcess',
                },
                eventId: 10044,
            });
            return r;
        }
        return Promise.resolve(null);
    }

    public async resumeProcess(
        id: IdExpression,
        options?: BpmnProcessInstanceOptions,
    ): Promise<BpmnEngineRuntimeApi | null> {
        const proc = await this.loadedProcessRepository.find(id);
        if (proc) {
            const r = await proc.resume(options);
            this.bpmsEngine?.HistoryService.create({
                type: 'info',
                source: this.name,
                message: `The process has been resumed`,
                data: {
                    definitionId: proc?.DefinitionId,
                    processId: proc.Id,
                    method: 'resumeProcess',
                },
                eventId: 10046,
            });
            return r;
        }
        return Promise.resolve(null);
    }

    public async queryDefinition<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.bpmnDefinitionRepository.query(options);
    }
    public async scalarDefinition(options: ScalarOptions): Promise<number> {
        return this.bpmnDefinitionRepository.scalar(options);
    }
    public async queryProcess<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.processRepository.query(options);
    }
    public async scalarProcess(options: ScalarOptions): Promise<number> {
        return this.processRepository.scalar(options);
    }

    public static getDefaultExtensions(): BpmnExtensions {
        return {
            // NowJsExtension: NowJsExtension(self),
            ProcessExtension: ProcessExtension,
            ProcessHistoryExtension: ProcessHistoryExtension,
            FormDataResolverExtension: FormDataResolverExtension,
            BusinessRuleTaskExtension: BusinessRuleTaskExtension,
            HumanInvolvementExtension: HumanInvolvementExtension,
            SaveToResultVariableExtension: SaveToResultVariableExtension,
            ServiceTaskExtension: ServiceTaskExtension,
            UserTaskExtension: UserTaskExtension,
            SaveToEnvironmentOutputExtension: SaveToEnvironmentOutputExtension,
            InputOutputExtension: InputOutputExtension,
            ExecutionListenerExtension: ExecutionListenerExtension,
            DynamicViewResolverExtension: DynamicViewResolverExtension,
            DynamicRouteResolverExtension: DynamicRouteResolverExtension,
        };
    }

    public static getDefaultBpmnServices(bpmnEngine: BpmnEngine): BpmnServices {
        return {
            createHistory(entry: any) {
                return function createHistoryService(executionContext, callback) {
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const svc = bpmnEngine.BpmsEngine.HistoryService;
                        svc.create({ ...entry, source: 'createHistoryService' }).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            createNotification(notification: any) {
                return function createNotificationService(executionContext, callback) {
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const svc = bpmnEngine.BpmsEngine.NotificationService;
                        svc.create({ ...notification }).then(r => {
                            return callback(r);
                        });
                    } else {
                        return callback(undefined);
                    }
                };
            },
            getGroups() {
                return function getGroupsService(executionContext, callback) {
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.IdentityService;
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.OrganizationService;
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.OrganizationService;
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.OrganizationService;
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.OrganizationService;
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.OrganizationService;
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.IdentityService;
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.IdentityService;
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const ids = bpmnEngine.BpmsEngine.IdentityService;
                        return ids.getUserByUsername(username);
                    } else {
                        return null;
                    }
                };
            },
            httpJsonApi: () => httpJsonApi,
            httpStreamApi: () => httpStreamApi,
            httpStringApi: () => httpStringApi,
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
                    if (bpmnEngine && bpmnEngine.BpmsEngine) {
                        const dmn = bpmnEngine.BpmsEngine.DmnEngine;
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
    }
}
