// tslint:disable-next-line:no-var-requires
const { decisionTable } = require("@hbtgmbh/dmn-eval-js");
import { uuidv1 } from "nowjs-core/lib/utils/UuidUtils";
import { BpmsEngine } from "../BpmsEngine";
import {
  DmnDefinitionMemoryPersistent,
  DmnDefinitionPersistency,
} from "./DmnDefinitionPersistency";

export interface DmnEngineOptions {
  name: string;
  definitionPersistency?: DmnDefinitionPersistency;
}
export class DmnEngine {
  private definitionCache: { [name: string]: any } = {};
  private id: string = uuidv1();
  private name: string;
  private options: DmnEngineOptions;
  private definitionPersistency: DmnDefinitionPersistency;
  public static createEngine(bpmsEngine?: BpmsEngine, options?: DmnEngineOptions): DmnEngine {
    return new DmnEngine(bpmsEngine, options);
  }
  constructor(private bpmsEngine?: BpmsEngine, options?: DmnEngineOptions) {
    this.options = options || { name: "DmnEngine-" + this.id };
    this.name = this.options.name;
    this.definitionPersistency =
      this.options.definitionPersistency || new DmnDefinitionMemoryPersistent();
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

  public get DefinitionPersistency(): DmnDefinitionPersistency {
    return this.definitionPersistency;
  }
  /**
   * register Dmn Definitions
   *
   * @param {string} name definiion name
   * @param {DmnDecision[]} decisions decisions
   * @returns {Promise<boolean>} return true
   * @memberof DmnEngine
   */
  public async registerDefinitions(
    name: string,
    decisions: DmnDecision[] | string,
  ): Promise<boolean> {
    let d = decisions;
    if (typeof decisions === "string") {
      const s = await this.definitionPersistency.find({ name });
      d = await this.parseDmnXml(d as string);
      if (!s) {
        this.definitionPersistency.persist({ name, definitions: decisions });
      }
    }
    this.definitionCache[name] = d;
    return Promise.resolve(true);
  }

  /**
   * Get decision from special definition name
   *
   * @param {string} name definition name
   * @returns {Promise<DmnDecision[]>}
   * @memberof DmnEngine
   */
  public async getDecisions(name: string): Promise<DmnDecision[]> {
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
   * @param {DmnDecision[]} decisions desicions to be evaluated
   * @param {*} context context to evaluate
   * @returns {(Promise<R|undefined>)}
   * @memberof DmnEngine
   */
  public async evaluateDecision<R = any>(
    decisionId: string,
    decisions: DmnDecision[],
    context: any,
  ): Promise<R | undefined> {
    const p = new Promise<R>((resolve, reject) => {
      try {
        const data = decisionTable.evaluateDecision(
          decisionId,
          decisions,
          context,
        );
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
   * @returns {Promise<DmnDecision[]>}
   * @memberof DmnEngine
   */
  public async parseDmnXml(
    xmlContent: string,
    options?: { lax?: boolean; model?: any },
  ): Promise<DmnDecision[]> {
    try {
      const decisions: DmnDecision[] = await decisionTable.parseDmnXml(
        xmlContent,
        options,
      );
      return decisions;
    } catch (error) {
      throw error;
    }
  }
}

// tslint:disable-next-line:no-empty-interface
export interface DmnEvaluationContext {}

export interface DmnDecisionTable {
  hitPolicy: "FIRST" | "UNIQUE" | "COLLECT" | "RULE ORDER" | "ANY";
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
export interface DmnDecision {}
export interface DmnEvaluateResult {}
