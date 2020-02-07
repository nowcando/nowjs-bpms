/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'nowjs-core';
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import {
    QueryOptions,
    QueryResult,
    ScalarOptions,
    BpmsBaseMemoryRepository,
    FilterExpression,
    IdExpression,
} from '../data/Repository';
import { BpmsService } from '../BpmsService';

export interface RouterServiceOptions {
    name: string;
}

export interface BpmsRoute {
    processDefinitionId?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    processName: string;
    processId?: string;
    id?: string;
    type?: string;
    key?: string;
    icon: string;
    target: string;
    title: string;
    enabled?: string;

    routeType: 'static' | 'dynamic';
    order?: string;
    category?: string;
    tags?: string;
    defaultView?: string;
    allowedViews?: string;
    authorization?: string;
}

export class RouterService<T extends BpmsRoute = BpmsRoute> implements BpmsService {
    private routerRepository!: BpmsBaseMemoryRepository<T>;
    private id: string = uuidv1();
    private options: RouterServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: RouterServiceOptions) {
        this.options = options || { name: 'RouterService' + this.id };
        this.routerRepository = new BpmsBaseMemoryRepository({
            storageName: 'BpmsRouter',
            keyPropertyname: 'id',
            properties: {
                id: { type: 'string', default: () => uuidv1() },
            },
        });
    }

    public static createService(options?: RouterServiceOptions): RouterService;
    public static createService(bpmsEngine?: BpmsEngine, options?: RouterServiceOptions): RouterService;
    public static createService(arg1?: BpmsEngine | RouterServiceOptions, arg2?: RouterServiceOptions): RouterService {
        if (arg1 instanceof BpmsEngine) {
            return new RouterService(arg1, arg2);
        }
        return new RouterService(undefined, arg1);
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

    public async clear(): Promise<void> {
        return this.routerRepository.clear();
    }

    public async create(entity: T): Promise<T> {
        return this.routerRepository.create(entity);
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.routerRepository.delete(entityId);
    }

    public async find(entityId: IdExpression): Promise<T | null>;
    public async find(filter: FilterExpression): Promise<T | null>;
    public async find(expression: string): Promise<T | null> {
        return this.routerRepository.find(expression);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.routerRepository.findAll(filter);
    }
    public async count(filter: FilterExpression): Promise<number> {
        return this.routerRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.routerRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.routerRepository.scalar(options);
    }
    // public async listViewNavigations() {
    //     if (this.BpmsEngine) {
    //         const views = await this.BpmsEngine.UIService.list();
    //         const navs = await this.navigatonRepository.findAll();
    //         const navViews = navs
    //             .linq()
    //             .groupBy(xx => xx.category)
    //             .toArray()
    //             .map(xx => {
    //                 return {
    //                     title: xx.key,
    //                     items: xx.values.toArray().map(nn => {
    //                         return {
    //                             ...nn,
    //                             views: views.filter(vv => vv.view.key.startsWith(nn.key || '')),
    //                         };
    //                     }),
    //                 };
    //             });

    //         return navViews;
    //     }
    //     return [];
    // }
}
