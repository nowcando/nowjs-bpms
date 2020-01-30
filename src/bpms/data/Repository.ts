/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { uuidv1, deepAssign } from 'nowjs-core/lib/utils';

export interface QueryOptions {
    projection?: string | string[] | object;
    filter?: FilterExpression;
    sortBy?: SortByExpression;
    groupBy?: GroupByExpression;
    paging?: {
        page?: number;
        limit?: number;
    };
    explain?: boolean;
}

export type IdExpression = string | number;
export type AggregationFunctions = 'count' | 'sum' | 'avg' | 'max' | 'min';
export type FilterExpression = string | Record<string, any>;
export type ProjectionExpression = string | string[] | Record<string, any>;
export type SortByExpression = string | string[] | Record<string, string>;
export type GroupByExpression = string | string[] | Record<string, string>;
export type AggregationExpression = string | Record<string, AggregationFunctions>;
export interface ScalarOptions {
    aggregation: AggregationExpression;
    filter?: FilterExpression;
}

export interface QueryResultSet<R> {
    results: QueryResult<R>[];
}

export interface QueryResult<R> {
    data: R[];
    paging?: {
        total?: number;
        limit?: number;
        page?: number;
    };
}

export interface BpmsQueryableRepository<T> {
    query<R = T>(options: QueryOptions): Promise<QueryResult<R>>;
    scalar(options: ScalarOptions): Promise<number>;
    count(propertyName?: string, filter?: FilterExpression): Promise<number>;
    max(propertyName: string, filter: FilterExpression): Promise<number>;
    min(propertyName: string, filter: FilterExpression): Promise<number>;
    sum(propertyName: string, filter: FilterExpression): Promise<number>;
    avg(propertyName: string, filter: FilterExpression): Promise<number>;
}

export interface BpmsRepository<T = any> extends BpmsQueryableRepository<T> {
    create<E = T, R = T>(entity: E): Promise<R>;
    update<E = T, R = T>(id: IdExpression, entity: E, upsert?: boolean): Promise<R>;
    updateAll<E = T, R = T>(filter: FilterExpression, entity: E, upsert?: boolean): Promise<R[]>;
    delete(id: IdExpression): Promise<boolean>;
    delete<E = T>(entity: E): Promise<boolean>;
    deleteAll(filter?: FilterExpression): Promise<number>;
    find<R = T>(id: IdExpression): Promise<R | null>;
    find<R = T>(filter: FilterExpression): Promise<R | null>;
    find<R = T>(expression: IdExpression | FilterExpression): Promise<R | null>;
    findAll<R = T>(filter?: FilterExpression): Promise<R[]>;
}

export interface BpmsMemoryRepositoryOptions {
    storageName: string;
    keyPropertyname?: string;
    paging?: { page?: number; limit?: number };
    properties?: Record<string, { type: string; default?: any }>;
}

const sumReducer = (field?: string) => (p, c, i, a) => {
    if (field) {
        return p[field] + c[field];
    }
    return p + c;
};
const countReducer = (field?: string) => (p, c, i, a) => {
    if (field && c[field]) {
        return i + 1;
    }
    return i + 1;
};
const maxReducer = (field?: string) => (p, c, i, a) => {
    if (field) {
        return Math.max(p[field], c[field]);
    }
    return Math.max(p, c);
};
const minReducer = (field?: string) => (p, c, i, a) => {
    if (field) {
        return Math.min(p[field], c[field]);
    }
    return Math.min(p, c);
};
const avgReducer = (field?: string) => (p, c, i, a) => {
    if (field) {
        if (i === a.length - 1) {
            return (p[field] + c[field]) / a.length;
        }
        return p[field] + c[field];
    }
    if (i === a.length - 1) {
        return (p + c) / a.length;
    }
    return p + c;
};
const funcs = { sumReducer, avgReducer, countReducer, maxReducer, minReducer };

export class BpmsBaseMemoryRepository<T = any> implements BpmsRepository<T> {
    private ds: T[] = [];
    private readonly defautOptions: any = {
        keyPropertyname: 'id',
        paging: { page: 1, limit: 10 },
        properties: {
            id: { type: 'string', default: () => uuidv1() },
            createdAt: { type: 'date', default: () => new Date() },
        },
    };
    private options: BpmsMemoryRepositoryOptions = this.defautOptions;
    constructor(options: BpmsMemoryRepositoryOptions) {
        if (!options.storageName) {
            throw new Error('Storage name in memory repository not defined');
        }
        this.options = Object.deepAssign(this.options, this.defautOptions, options);
    }
    public async create<E = T, R = T>(entity: E): Promise<R> {
        if (entity) {
            // set default values
            for (const key in this.options.properties) {
                if (!entity[key]) {
                    const d =
                        (this.options.properties &&
                            this.options.properties[key] &&
                            this.options.properties[key].default &&
                            this.options.properties[key].default()) ||
                        null;
                    entity[key] = d;
                }
            }
            // check key field existance
            const k = this.options.keyPropertyname || 'id';
            const s = this.ds.some(xx => xx[k] === entity[k]);
            if (s) {
                throw new Error('Create failed . Entity id already exist');
            }
            // const a = { createdAt: new Date(), ...entity } as any;
            this.ds.push(entity as any);
        }
        return Promise.resolve(entity as any);
    }
    public async update<E = T, R = T>(id: IdExpression, entity: E, upsert?: boolean): Promise<R> {
        if (entity) {
            const ix = this.ds.findIndex((xx: any) => xx.id === id);
            if (ix >= 0) {
                entity['updatedAt'] = new Date();
                this.ds[ix] = entity as any;
                Promise.resolve(this.ds[ix] as any);
            } else {
                if (upsert) {
                    this.create(entity);
                } else {
                    throw new Error('Update failed . Entity id not found');
                }
            }
        }
        return Promise.resolve(entity as any);
    }
    public async updateAll<E = T, R = T>(filter: FilterExpression, entity: E, upsert?: boolean): Promise<R[]> {
        if (entity) {
            const q = this.getFilterExpression(filter);
            const dt = this.ds.filter(q);
            for (let item of dt) {
                item = { ...item, updatedAt: new Date(), ...entity };
                // item = deepAssign(item, entity, { updatedAt: new Date() });
            }
            return dt as any;
        }
        return Promise.resolve(entity as any);
    }
    public async delete(id: IdExpression): Promise<boolean>;
    public async delete<E = T>(entity: E): Promise<boolean>;
    public async delete(entity: any) {
        if (entity) {
            const ix =
                typeof entity === 'object'
                    ? this.ds.indexOf(entity as any)
                    : this.ds.findIndex((xx: any) => xx.id === entity);
            if (ix >= 0) {
                this.ds.splice(ix, 1);
                Promise.resolve(true);
            } else {
                throw new Error('Delete failed . Entity id not found');
            }
        }
        return Promise.resolve(false);
    }
    public async deleteAll(filter?: FilterExpression): Promise<number> {
        if (!filter) {
            const c = this.ds.length;
            this.ds.length = 0;
            return Promise.resolve(c);
        } else {
            const q = this.getFilterExpression(filter, true);
            const dt = this.ds.filter(q);
            this.ds = dt;
            return Promise.resolve(dt.length);
        }
    }

    public async find<R = T>(id: IdExpression): Promise<R | null>;
    public async find<R = T>(filter: FilterExpression): Promise<R | null>;
    public async find<R = T>(expression: IdExpression | FilterExpression): Promise<R | null> {
        const key = this.options.keyPropertyname || 'id';
        let d: T[] = []; //
        if (typeof expression === 'object') {
            const e = this.getFilterExpression(expression);
            d = this.ds.filter(e);
        } else {
            d = this.ds.filter(xx => xx[key] === expression);
        }
        if (d && d.length >= 0) {
            return Promise.resolve(d[0] as any);
        } else {
            return Promise.resolve(null);
        }
    }
    public async findAll<R = T>(filter?: FilterExpression): Promise<R[]> {
        if (filter) {
            const q = this.getFilterExpression(filter);
            const dt = this.ds.filter(q);
            return Promise.resolve(dt as any);
        } else {
            return Promise.resolve(this.ds.slice(0) as any);
        }
    }
    public async query<R = T>(options: QueryOptions): Promise<QueryResult<R>> {
        let r: T[] = [];
        const q = options.filter && this.getFilterExpression(options.filter);
        if (q) {
            r = this.ds.filter(q);
        }
        const s = options.sortBy && this.getSortExpression(options.sortBy);
        if (s) {
            r = r.sort(s);
        }
        if (options.groupBy) {
            const ng = this.getGroupExpression(options.groupBy);
            // const fg = x => x[ng];
            // const g = r.linq().groupBy(fg);
            // TODO : implement nested group by
        }
        const result: QueryResult<R> = { data: r as any };
        if (options.paging) {
            const p = { ...this.defautOptions.paging, ...options.paging };
            const page = p.page;
            const limit = p.limit;
            const total = r.length;
            const start = (page - 1) * limit;
            const end = Math.min(page * limit, total);
            r = r.slice(start, end);
            result.data = r as any;
            result.paging = { page, limit, total };
        }
        return Promise.resolve(result as any);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        let r: T[] = [];
        const q = options.filter && this.getFilterExpression(options.filter);
        if (q) {
            r = this.ds.filter(q);
        } else {
            r = this.ds;
        }
        const result: number = this.getAggregationResult(r, options.aggregation);
        return Promise.resolve(result);
    }
    public async count(propertyName?: string, filter?: FilterExpression): Promise<number> {
        return this.scalar({ filter, aggregation: `count(${propertyName || 'id'})` });
    }
    public async max(propertyName: string, filter: FilterExpression): Promise<number> {
        return this.scalar({ filter, aggregation: `max(${propertyName})` });
    }
    public async min(propertyName: string, filter: FilterExpression): Promise<number> {
        return this.scalar({ filter, aggregation: `min(${propertyName})` });
    }
    public async sum(propertyName: string, filter: FilterExpression): Promise<number> {
        return this.scalar({ filter, aggregation: `sum(${propertyName})` });
    }
    public async avg(propertyName: string, filter: FilterExpression): Promise<number> {
        return this.scalar({ filter, aggregation: `avg(${propertyName})` });
    }

    private getAggregationResult(source: T[], aggregation: AggregationExpression): number {
        const n = 'id';
        const s = typeof aggregation === 'string' ? aggregation : 'count';
        const g = this.getAggregationExpressionReducer(s);
        const r = source
            .map(x => {
                if (!x) return 0;
                const t = typeof x[n];
                if (t === 'bigint' || t === 'number') {
                    return x[n];
                }
                {
                    return 0;
                }
            })
            .reduce(g, 0);
        return r;
    }
    private getAggregationExpressionReducer(s: string): (p: T, c: T, i: number, a: T[]) => number {
        const ex = /^(\w+)(\(\s*(\w+)\s*\))?$/gi;
        const m = ex.exec(s);
        const f = (m && m[1]) || 'count';
        const p = m && m[3];
        return funcs[f + 'Reducer'](p);
    }
    private getFilterExpression<S extends T>(
        filter: FilterExpression,
        reverse?: boolean,
    ): (value: T, index: number, array: T[]) => S {
        const f = this.buildFilterExpression(filter);
        return f;
    }
    private buildFilterExpression(expression: FilterExpression) {
        if (!expression) {
            return ($v, $i, $a) => $v;
        }
        if (typeof expression === 'string') {
            return eval(expression);
        }
        let s = '';
        const eps: string[] = [];
        for (const key in expression) {
            if (expression.hasOwnProperty(key)) {
                const lhs = key;
                const rhs = expression[key];
                // TODO: must be completed to work with any opType or opCodes
                const opType = 'bitwise';
                const opCode = '===';
                if (rhs !== undefined) {
                    if (opType === 'bitwise') {
                        if (typeof rhs === 'string') {
                            eps.push(`$v.${lhs} ${opCode} '${rhs}'`);
                        } else {
                            eps.push(`$v.${lhs} ${opCode} ${rhs}`);
                        }
                    }
                }
            }
        }
        s = eps.join(' && ');
        if (!s) {
            return ($v, $i, $a) => $v;
        }
        return eval(`($v,$i,$a) => { 
            return ${s} ;
        }`);
    }

    private getSortExpression(sort: SortByExpression): (a: T, b: T) => number {
        return (a, b) => {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        };
    }

    private getGroupExpression(group: GroupByExpression): { key: string }[] {
        let result: any[] = [];
        if (typeof group === 'string') {
            result = group.split(',').map(x => ({ key: x }));
        } else if (Array.isArray(group)) {
            result = group.map(x => ({ key: x }));
        } else if (typeof group === 'object') {
            for (const key in group) {
                result.push({ key });
            }
        } else {
            return result;
        }
        return result;
    }
}
