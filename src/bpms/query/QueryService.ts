/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import {
    QueryOptions,
    QueryResult,
    ScalarOptions,
    FilterExpression,
    BpmsRepository,
    QueryResultSet,
} from '../data/Repository';
import { BpmsService } from '../BpmsService';

// export interface IBpmsQueryable{
//     query<R>(options: QueryOption): Promise<QueryResult<R>>;
//     scalar<R extends number>(filter: string | object): Promise<R>;
// }

export interface QueryServiceOptions {
    name: string;
}

export type SourceName = string | string[];

export class QueryService implements BpmsService {
    private id: string = uuidv1();
    private options: QueryServiceOptions;
    private sources: Record<string, BpmsRepository<any>> = {};
    constructor(private bpmsEngine?: BpmsEngine, options?: QueryServiceOptions) {
        const self = this;
        this.options = options || { name: 'QueryService' + this.id };
        self.loadRepositories();
    }

    public static createService(options?: QueryServiceOptions): QueryService;
    public static createService(bpmsEngine?: BpmsEngine, options?: QueryServiceOptions): QueryService;
    public static createService(arg1?: BpmsEngine | QueryServiceOptions, arg2?: QueryServiceOptions): QueryService {
        if (arg1 instanceof BpmsEngine) {
            return new QueryService(arg1, arg2);
        }
        return new QueryService(undefined, arg1);
    }

    public get Id(): string {
        return this.id;
    }

    public get Name(): string {
        return this.options.name;
    }
    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }

    public async getRepositories(): Promise<Record<string, BpmsRepository<any>>> {
        return this.sources;
    }

    public async count(source: SourceName, filter?: FilterExpression): Promise<QueryResultSet<number>> {
        const s: string[] = typeof source === 'string' ? source.split(',') : source;
        const h = this.getExecutingRepositories(source);
        const p = h.map(xx => xx.count('id', filter));
        const r = await Promise.all(p);
        const m: any = {};
        s.forEach((v, i) => {
            m[v] = r[i];
        });
        return { results: m };
    }

    public async query<R>(source: SourceName, options: QueryOptions): Promise<QueryResultSet<QueryResult<R>>> {
        const s: string[] = typeof source === 'string' ? source.split(',') : source;
        const h = this.getExecutingRepositories(source);
        const p = h.map(xx => xx.query(options));
        const r = await Promise.all(p);
        const m: any = {};
        s.forEach((v, i) => {
            m[v] = r[i];
        });
        return { results: m };
    }
    public async scalar(source: SourceName, options: ScalarOptions): Promise<QueryResultSet<number>> {
        const s: string[] = typeof source === 'string' ? source.split(',') : source;
        const h = this.getExecutingRepositories(source);
        const p = h.map(xx => xx.scalar(options));
        const r = await Promise.all(p);
        const m: any = {};
        s.forEach((v, i) => {
            m[v] = r[i];
        });
        return { results: m };
    }

    private getExecutingRepositories(source: string | string[]): BpmsRepository<any>[] {
        const s: string[] = typeof source === 'string' ? source.split(',') : source;
        return Object.entries(this.sources)
            .filter(xx => s.includes(xx[0]))
            .map(xx => xx[1]);
    }

    private loadRepositories() {
        for (const k in this.BpmsEngine) {
            if (typeof this.BpmsEngine[k] === 'object' && (k.endsWith('Service') || k.endsWith('Engine'))) {
                for (const m in this.BpmsEngine[k]) {
                    if (m.endsWith('Repository')) {
                        this.sources[m.replace('Repository', '')] = this.BpmsEngine[k][m];
                    }
                }
            }
        }
    }
}
