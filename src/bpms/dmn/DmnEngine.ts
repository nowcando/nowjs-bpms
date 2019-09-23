// tslint:disable-next-line:no-var-requires
const { decisionTable } = require("@hbtgmbh/dmn-eval-js");
import { uuidv1 } from "nowjs-core/lib/utils/UuidUtils";

export interface DmnEngineOptions {
  name: string;
}
export class DmnEngine {
  private definitionCache: { [name: string]: any } = {};
  private id: string = uuidv1();
  private name: string;
  private options: DmnEngineOptions;
  public static createEngine(options?: DmnEngineOptions): DmnEngine {
    return new DmnEngine(options);
  }
  constructor(options?: DmnEngineOptions) {
    this.options = options || { name: "DmnEngine-" + this.id };
    this.name = this.options.name;
  }

  public get Id(): string {
    return this.id;
  }

  public get Name(): string {
    return this.name;
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
    decisions: DmnDecision[],
  ): Promise<boolean> {
      this.definitionCache[name] = decisions;
      return Promise.resolve(true);
  }

  /**
   * Get decision from special definition name
   *
   * @param {string} name definition name
   * @returns {Promise<DmnDecision[]>}
   * @memberof DmnEngine
   */
  public async getDecisions(
    name: string,
  ): Promise<DmnDecision[]> {
    const decisions =  this.definitionCache[name];
    return Promise.resolve(decisions);
  }

  /**
   * Get all cached Dmn definitions
   *
   * @returns {Promise<string[]>}
   * @memberof DmnEngine
   */
  public async getDefinitionNames(): Promise<string[]> {
    return  Promise.resolve(Object.keys(this.definitionCache));
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
