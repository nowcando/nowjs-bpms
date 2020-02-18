/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-var-requires */
// tslint:disable-next-line:no-var-requires
const { decisionTable } = require('@hbtgmbh/dmn-eval-js');
import { uuidv1 } from 'nowjs-core/lib/utils/UuidUtils';
import { BpmsEngine } from '../BpmsEngine';
import { DmnDefinitionMemoryRepository, DmnDefinitionRepository } from './DmnDefinitionRepository';
import { QueryOptions, QueryResult, ScalarOptions, FilterExpression, IdExpression } from '../data/Repository';

// tslint:disable-next-line:no-empty-interface
export interface DmnEvaluationContext {}

export interface DmnDecisionTable {
    hitPolicy: 'FIRST' | 'UNIQUE' | 'COLLECT' | 'RULE ORDER' | 'ANY';
    rules: DmnDecisionTableRule[];
    input: string[];
    output: string[];

    inputExpressions?: any[];

    parsedInputExpressions?: any[];
    outputNames?: string[];
}

export interface DmnDecisionTableRule {
    inputValues?: any[];
    outputValues?: any[];
}
// tslint:disable: no-empty-interface
export interface DmnDecision {
    name: string;
    decisionTable: DmnDecisionTable;
    requiredDecisions: any[];
}
export interface DmnDefinition {
    [name: string]: DmnDecision;
}
export interface DmnEvaluateResult {}
export interface DmnEngineOptions {
    name: string;
    dmnDefinitionRepository?: DmnDefinitionRepository;
}
export interface BpmsDmnDefinition {
    id?: string;
    name: string;
    definitions: string;
    createdAt?: Date;
}
export class DmnEngine {
    // private definitionCache: { [name: string]: any } = {};
    private id: string = uuidv1();
    private name: string;
    private options: DmnEngineOptions;
    private dmnDefinitionRepository: DmnDefinitionRepository;

    public static createEngine(options?: DmnEngineOptions): DmnEngine;
    public static createEngine(bpmsEngine?: BpmsEngine, options?: DmnEngineOptions): DmnEngine;
    public static createEngine(arg1?: BpmsEngine | DmnEngineOptions, arg2?: DmnEngineOptions): DmnEngine {
        if (arg1 instanceof BpmsEngine) {
            return new DmnEngine(arg1, arg2);
        }
        return new DmnEngine(undefined, arg1);
    }

    constructor(private bpmsEngine?: BpmsEngine, options?: DmnEngineOptions) {
        this.options = options || { name: 'DmnEngine-' + this.id };
        this.name = this.options.name;
        this.dmnDefinitionRepository = this.options.dmnDefinitionRepository || new DmnDefinitionMemoryRepository();
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

    /**
     * register Dmn Definitions
     *
     * @param {string} name definiion name
     * @param {DmnDecision[]} definitions decisions
     * @returns {Promise<boolean>} return true
     * @memberof DmnEngine
     */
    public async create(entity: BpmsDmnDefinition): Promise<BpmsDmnDefinition> {
        if (!entity) {
            throw new Error(`The BPMN definition entity ${entity} required`);
        }
        const df = entity.definitions;
        const s = await this.dmnDefinitionRepository.find({ name: entity.name });
        // d =  await this.parseDmnXml(df);
        if (!s) {
            const r = await this.dmnDefinitionRepository.create({ ...entity, version: 1 });
            // this.definitionCache[entity.name] = d;
            this.bpmsEngine?.HistoryService.create({
                type: 'info',
                source: this.name,
                message: `The dmn definition has been created`,
                data: {
                    definitionId: r.id,
                    definitionName: r.name,
                    definitionVersion: r.version,
                    definitions: r.definitions,
                    method: 'create',
                },
                eventId: 10021,
            });
            return r;
        }
        throw new Error('The DMN definition already exists');
    }

    public async update(entity: BpmsDmnDefinition): Promise<BpmsDmnDefinition> {
        if (!entity) {
            throw new Error(`The BPMN definition entity ${entity} required`);
        }
        const df = entity.definitions;
        const id = entity.id;
        const s = await this.dmnDefinitionRepository.find({ id: entity.id });
        // d = await this.parseDmnXml(df);
        if (s && id) {
            const r = await this.dmnDefinitionRepository.update(id, {
                ...s,
                ...entity,
                id,
                version: s.version ? s.version + 1 : 1,
            });
            // this.definitionCache[entity.name] = d;
            this.bpmsEngine?.HistoryService.create({
                type: 'info',
                source: this.name,
                message: `The dmn definition has been updated`,
                data: {
                    definitionId: r.id,
                    definitionName: r.name,
                    definitionVersion: r.version,
                    definitions: r.definitions,
                    method: 'update',
                },
                eventId: 10023,
            });
            return r;
        }
        throw new Error(`The DMN definition id '${id}' not exists`);
    }

    /**
     * Get decision from special definition name
     *
     * @param {string} name definition name
     * @returns {Promise<BpmsDmnDefinition>}
     * @memberof DmnEngine
     */
    public async getDecisionsByName(name: string): Promise<DmnDefinition | null> {
        const d = await this.find({ name });
        if (d) {
            const ds = this.parseDmnXml(d.definitions);
            return ds;
        }
        return null;
    }
    /**
     * Get decision from special definition name
     *
     * @param {string} name definition name
     * @returns {Promise<BpmsDmnDefinition>}
     * @memberof DmnEngine
     */
    public async getDecisionsById(id: IdExpression): Promise<BpmsDmnDefinition | null> {
        const decisions = await this.dmnDefinitionRepository.find({ id });
        return Promise.resolve(decisions);
    }

    /**
     * Get all cached Dmn definitions
     *
     * @returns {Promise<string[]>}
     * @memberof DmnEngine
     */
    public async getDefinitionNames(): Promise<string[]> {
        const definitions = await this.dmnDefinitionRepository.findAll();
        const l = definitions.map(xx => xx.name);
        return Promise.resolve(l);
    }

    /**
     * evaluate Decision from decision in the special context
     *
     * @param {DmnDecision} decision desicions to be evaluated
     * @param {*} context context to evaluate
     * @returns {(Promise<R|undefined>)}
     * @memberof DmnEngine
     */
    public async evaluateDecision<R = Record<string, any>>(
        decision: DmnDecision | string,
        context: any,
    ): Promise<R | undefined> {
        const p = new Promise<R>(async (resolve, reject) => {
            try {
                let ds;
                let decisionId;
                if (typeof decision === 'string') {
                    const a = decision.split('/');
                    const definitionName = a[0];
                    decisionId = a[1];
                    ds = await this.getDecisionsByName(definitionName);
                } else {
                    ds = [];
                    ds[decision.name] = decision;
                    decisionId = decision.name;
                }
                if (!ds) {
                    reject(new Error(`The decision ${typeof decision === 'string' ? decision : decisionId} not found`));
                    return;
                }

                const data = decisionTable.evaluateDecision(decisionId, ds, context);
                this.bpmsEngine?.HistoryService.create({
                    type: 'info',
                    source: this.name,
                    message: `The decision has been evaluated`,
                    data: {
                        decisionId: decisionId,
                        method: 'evaluateDecision',
                        context,
                    },
                    eventId: 10026,
                });
                resolve(data);
                return;
            } catch (error) {
                reject(error);
                return;
            }
        });
        return p;
    }

    /**
     * Parse dmn xml content to create dmn decisions
     *
     * @param {string} xmlContent xml content
     * @param {{ lax?: boolean; model?: any }} [options] xml reader options
     * @returns {Promise<DmnDefinition>}
     * @memberof DmnEngine
     */
    public async parseDmnXml(xmlContent: string, options?: { lax?: boolean; model?: any }): Promise<DmnDefinition> {
        try {
            const decisions: DmnDefinition = await decisionTable.parseDmnXml(xmlContent, options);
            for (const key in decisions) {
                if (decisions.hasOwnProperty(key)) {
                    const element = decisions[key];
                    element.name = key;
                }
            }
            return decisions;
        } catch (error) {
            throw error;
        }
    }

    public async clear(): Promise<void> {
        return this.dmnDefinitionRepository.clear();
    }

    public async count(): Promise<number> {
        return this.dmnDefinitionRepository.count();
    }
    public async find<R extends BpmsDmnDefinition = BpmsDmnDefinition>(filter: IdExpression): Promise<R | null>;
    public async find<R extends BpmsDmnDefinition = BpmsDmnDefinition>(filter: FilterExpression): Promise<R | null>;
    public async find<R extends BpmsDmnDefinition = BpmsDmnDefinition>(expression: any): Promise<R | null> {
        return this.dmnDefinitionRepository.find<R>(expression);
    }
    public async load<R extends BpmsDmnDefinition = BpmsDmnDefinition>(filter?: FilterExpression): Promise<R[]> {
        return this.dmnDefinitionRepository.findAll(filter);
    }

    public async list<R extends BpmsDmnDefinition = BpmsDmnDefinition>(filter?: FilterExpression): Promise<R[]> {
        return this.dmnDefinitionRepository.findAll(filter);
    }

    public async remove(id: IdExpression): Promise<boolean> {
        return this.dmnDefinitionRepository.delete(id);
    }

    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.dmnDefinitionRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.dmnDefinitionRepository.scalar(options);
    }
}
