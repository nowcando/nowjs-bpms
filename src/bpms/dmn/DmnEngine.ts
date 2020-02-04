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
    definitions: DmnDefinition | string;
    createdAt?: Date;
}
export class DmnEngine {
    private definitionCache: { [name: string]: any } = {};
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
        let d = entity.definitions;
        const s = await this.dmnDefinitionRepository.find({ name: entity.name });
        d = typeof entity.definitions === 'string' ? await this.parseDmnXml(d as string) : d;
        if (!s) {
            const r = await this.dmnDefinitionRepository.create(entity);
            this.definitionCache[entity.name] = d;
            return r;
        }
        throw new Error('The dmn definition already exists');
    }

    public async update(entity: BpmsDmnDefinition): Promise<BpmsDmnDefinition> {
        if (!entity) {
            throw new Error(`The BPMN definition entity ${entity} required`);
        }
        let d = entity.definitions;
        const id = entity.id;
        const s = await this.dmnDefinitionRepository.find({ id: entity.id });
        d = typeof entity.definitions === 'string' ? await this.parseDmnXml(d as string) : d;
        if (s && id) {
            const r = await this.dmnDefinitionRepository.update(id, entity);
            this.definitionCache[entity.name] = d;
            return r;
        }
        throw new Error(`The DMN definition id '${id}' not exists`);
    }

    /**
     * Get decision from special definition name
     *
     * @param {string} name definition name
     * @returns {Promise<DmnDefinition>}
     * @memberof DmnEngine
     */
    public async getDecisions(name: string): Promise<DmnDefinition> {
        const decisions = this.definitionCache[name];
        return Promise.resolve(decisions);
    }

    /**
     * Get all cached Dmn definitions
     *
     * @returns {Promise<string[]>}
     * @memberof DmnEngine
     */
    public async getDefinitionNames(): Promise<string[]> {
        return Promise.resolve(Object.keys(this.definitionCache));
    }

    /**
     * Clear all cached Dmn Definitions
     *
     * @returns {Promise<void>}
     * @memberof DmnEngine
     */
    public async clearAllDefinitions(): Promise<void> {
        this.definitionCache = {};
        return Promise.resolve();
    }

    /**
     * evaluate Decision from decision in the special context
     *
     * @param {string} decisionId start decision id
     * @param {DmnDefinition} decisions desicions to be evaluated
     * @param {*} context context to evaluate
     * @returns {(Promise<R|undefined>)}
     * @memberof DmnEngine
     */
    public async evaluateDecision<R = any>(
        decisionId: string,
        decisions: DmnDefinition | string,
        context: any,
    ): Promise<R | undefined>;
    public async evaluateDecision<R = any>(
        arg1: string,
        arg2: DmnDefinition | string,
        arg3: any,
    ): Promise<R | undefined> {
        const p = new Promise<R>(async (resolve, reject) => {
            try {
                if (typeof arg2 === 'string') {
                    arg2 = await this.getDecisions(arg2 as string);
                }
                if (!arg2) {
                    return Promise.resolve(undefined);
                }
                const data = decisionTable.evaluateDecision(arg1, arg2, arg3);
                resolve(data);
            } catch (error) {
                reject(error);
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

    public async persist<R extends BpmsDmnDefinition = BpmsDmnDefinition>(entity: R): Promise<boolean> {
        if (entity && entity.id) {
            const r = await this.dmnDefinitionRepository.update(entity.id, entity);
            return r !== null;
        } else {
            return false;
        }
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
