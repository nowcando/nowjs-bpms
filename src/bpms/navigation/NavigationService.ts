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
} from '../data/Repository';

export interface NavigationServiceOptions {
    name: string;
}

export interface BpmsNavigation {
    definitionName: string;
    processName: string;
    processId?: string;
    definitionId?: string;
    id?: string;
    type?: string;
    key?: string;
    icon: string;
    target: string;
    title: string;
    enabled?: string;
    order?: string;
    category?: string;
    tags?: string;
    defaultView?: string;
    allowedViews?: string;
    authorization?: string;
}

export class NavigationService<T extends BpmsNavigation = BpmsNavigation> {
    private navigatonRepository!: BpmsBaseMemoryRepository<T>;
    private id: string = uuidv1();
    private options: NavigationServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: NavigationServiceOptions) {
        this.options = options || { name: 'NavigationService' + this.id };
        this.navigatonRepository = new BpmsBaseMemoryRepository({
            storageName: 'Navigation',
            keyPropertyname: 'id',
            properties: {},
        });
    }

    public static createService(options?: NavigationServiceOptions): NavigationService;
    public static createService(bpmsEngine?: BpmsEngine, options?: NavigationServiceOptions): NavigationService;
    public static createService(
        arg1?: BpmsEngine | NavigationServiceOptions,
        arg2?: NavigationServiceOptions,
    ): NavigationService {
        if (arg1 instanceof BpmsEngine) {
            return new NavigationService(arg1, arg2);
        }
        return new NavigationService(undefined, arg1);
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
        return this.navigatonRepository.clear();
    }

    public async create(definitionName: string, view: any): Promise<T> {
        const d = { definitionName, view };
        return this.navigatonRepository.create(d);
    }
    public async findView(processName: string, viewName: string): Promise<T | null> {
        return this.navigatonRepository.find({ processName, viewName });
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.navigatonRepository.delete(entityId);
    }

    public async find(entityId: string): Promise<T | null> {
        return this.navigatonRepository.find(entityId);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.navigatonRepository.findAll(filter);
    }
    public async count(filter: FilterExpression): Promise<number> {
        return this.navigatonRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.navigatonRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.navigatonRepository.scalar(options);
    }
    public async listViewNavigations() {
        if (this.BpmsEngine) {
            const views = await this.BpmsEngine.UIService.list();
            const navs = await this.navigatonRepository.findAll();
            const navViews = navs
                .linq()
                .groupBy(xx => xx.category)
                .toArray()
                .map(xx => {
                    return {
                        title: xx.key,
                        items: xx.values.toArray().map(nn => {
                            return {
                                ...nn,
                                views: views.filter(vv => vv.view.key.startsWith(nn.key || '')),
                            };
                        }),
                    };
                });

            return navViews;
        }
        return [];
    }
}
