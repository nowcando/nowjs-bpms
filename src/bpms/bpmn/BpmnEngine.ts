/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { BpmnDefinitionMemoryRepository, BpmnDefinitionRepository } from './BpmnDefinitionRepository';
import { BpmnProcessInstance, BpmnProcessOptions, BpmnProcess } from './BpmnProcessInstance';
import { BpmnProcessMemoryRepository, BpmnProcessRepository } from './BpmnProcessRepository';
import BusinessRuleTask from './elements/BusinessRuleTask';
import { IdExpression, FilterExpression, BpmsBaseMemoryRepository } from '../data/Repository';
export type BpmnSource = string;

export interface BpmnEngineOptions {
    name: string;
    processRepository?: BpmnProcessRepository;
    bpmnDefinitionRepository?: BpmnDefinitionRepository;
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

export interface BpmnDefinition {
    id: string;
    name: string;
    definitions: any;

    createdAt?: Date;
}

// export interface BpmnProcess {
//     id: string;
//     name: string;
// }

export interface BpmnDefinitionLoadOptions {
    filter?: FilterExpression;
}

export interface BpmnDefinitionPersistOptions {
    id: string;
    bpmnProcess: BpmnProcess;
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
    constructor(arg1?: BpmsEngine | BpmnEngineOptions, arg2?: BpmnEngineOptions) {
        if (arg1 instanceof BpmsEngine) {
            this.bpmsEngine = arg1;
            this.options = arg2 || { name: 'BpmnEngine-' + this.id };
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

    public async createDefinitions(name: string, source: BpmnSource): Promise<boolean> {
        const self = this;
        const f = await this.bpmnDefinitionRepository.find({ name });
        if (!f) {
            await this.bpmnDefinitionRepository.create({ definitions: source, name });
        }
        return Promise.resolve(true);
    }

    public async countDefinitions(): Promise<number> {
        return this.bpmnDefinitionRepository.count();
    }

    public async findDefinition<R extends BpmnDefinition = BpmnDefinition>(id: IdExpression): Promise<R | null>;
    public async findDefinition<R extends BpmnDefinition = BpmnDefinition>(filter: FilterExpression): Promise<R | null>;
    public async findDefinition<R extends BpmnDefinition = BpmnDefinition>(expression: any): Promise<R | null> {
        return this.bpmnDefinitionRepository.find<R>(expression);
    }

    public async findProcess<R extends BpmnProcess = BpmnProcess>(id: IdExpression): Promise<R | null>;
    public async findProcess<R extends BpmnProcess = BpmnProcess>(filter: FilterExpression): Promise<R | null>;
    public async findProcess<R extends BpmnProcess = BpmnProcess>(expression: any): Promise<R | null> {
        return this.processRepository.find<R>(expression);
    }

    public async loadDefinitions<R extends BpmnDefinition = BpmnDefinition>(
        options: BpmnDefinitionLoadOptions,
    ): Promise<R[]> {
        const filter = options.filter;
        const d = await this.bpmnDefinitionRepository.findAll<R>(filter);
        return d;
    }

    public async removeDefinition(id: IdExpression): Promise<boolean> {
        return this.bpmnDefinitionRepository.delete(id);
    }

    public async listDefinitions<R extends BpmnDefinition>(filter?: FilterExpression): Promise<R[]> {
        return this.bpmnDefinitionRepository.findAll<R>(filter);
    }

    public async clearDefinitions(): Promise<void> {
        await this.bpmnDefinitionRepository.deleteAll();
        return;
    }

    public async createProcess(options?: BpmnProcessOptions): Promise<BpmnProcessInstance> {
        const self = this;
        const p = new Promise<BpmnProcessInstance>(async (resolve, reject) => {
            try {
                // using  registered definition if name already registered .
                if (options && options.name && !options.source) {
                    const d = await this.bpmnDefinitionRepository.find({
                        name: options.name,
                    });
                    if (d) {
                        options.source = d.definitions;
                    }
                }
                const proc = new BpmnProcessInstance(self, options);
                await this.loadedProcessRepository.update(proc.Id, proc, true);
                // this.loadedProcsses[proc.Id] = proc;
                proc.onEnd(async () => {
                    await this.loadedProcessRepository.delete(proc.Id);
                    //  delete this.loadedProcsses[proc.Id];
                });
                //  proc.onActivityWait((a, b) => this.onProcessWaitActivity.call(this, proc, a, b));
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
    public async registeredDefinitionCount(): Promise<number> {
        return this.bpmnDefinitionRepository.count();
    }

    public async persistedProcessCount(): Promise<number> {
        return this.processRepository.count();
    }

    public async loadedProcessList(): Promise<BpmnProcessInstance[]> {
        return this.loadedProcessRepository.findAll();
    }

    /**
     * Recover process state from persistency source
     *
     * @param {BpmnEngineRecoverOptions} [options]
     * @returns {Promise<boolean>}
     * @memberof BpmnEngine
     */
    public async recoverProcesses(options?: BpmnEngineRecoverOptions): Promise<boolean> {
        try {
            if (options) {
                const plist = await this.processRepository.findAll({
                    id: options.id,
                    name: options.name,
                });
                const clist = await this.loadedProcessList();
                for (const pitem of plist) {
                    if (!clist.some(xx => xx.Id === pitem.id)) {
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
                const plist = await this.processRepository.findAll();
                const clist = await this.loadedProcessList();
                for (const pitem of plist) {
                    if (!clist.some(xx => xx.Id === pitem.id)) {
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
    public async persistProcess(options?: BpmnEnginePersistOptions): Promise<boolean> {
        try {
            if (options) {
                // xx => (options.id && options.id === xx[1].Id) || options.name === xx[1].Name,
                const item =
                    (options.id && (await this.loadedProcessRepository.find({ id: options.id }))) ||
                    (await this.loadedProcessRepository.find({ name: options.name }));
                if (item) {
                    const p = item;
                    const d = await p.getState();
                    const r = await this.processRepository.update(
                        p.Id,
                        {
                            id: p.Id,
                            name: p.Name,
                            data: d,
                        },
                        true,
                    );
                    return Promise.resolve(r !== null);
                }
                return Promise.resolve(false);
            } else {
                const items = await this.loadedProcessRepository.findAll();
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
                                data: d,
                            },
                            true,
                        );
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
    public async stopProcesses(persist = true): Promise<void> {
        if (persist === true) {
            await this.persistProcess();
        }
        const processes = await this.loadedProcessList();
        for (const process of processes) {
            process.stop();
        }
        await this.loadedProcessRepository.deleteAll();
        return Promise.resolve();
    }

    // public async queryDefinition<R>(options: QueryOptions): Promise<QueryResult<R>> {
    //     return this.definitionRepository.query(options);
    // }
    // public async scalarDefinition<R extends number>(options: ScalarOptions): Promise<R> {
    //     return this.definitionRepository.scalar(options);
    // }
    // public async queryProcess<R>(options: QueryOptions): Promise<QueryResult<R>> {
    //     return this.processRepository.query(options);
    // }
    // public async scalarProcess<R extends number>(options: ScalarOptions): Promise<R> {
    //     return this.processRepository.scalar(options);
    // }
}
