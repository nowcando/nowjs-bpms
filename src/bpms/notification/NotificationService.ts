/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { QueryOptions, QueryResult, ScalarOptions, FilterExpression } from '../data/Repository';
import { NotificationRepository, NotificationMemoryRepository } from './NotificationRepository';
import { BpmsService } from '../BpmsService';

export interface NotificationServiceOptions {
    notificationRepository?: NotificationRepository;
    name: string;
}

export interface BpmsNotification {
    id: string;
    message: string;

    to: string;
    delivered: boolean;
    seen: boolean;
}

export class NotificationService<T extends BpmsNotification = BpmsNotification> implements BpmsService {
    private notificationRepository!: NotificationRepository<T>;
    private id: string = uuidv1();
    private options: NotificationServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: NotificationServiceOptions) {
        this.options = options || { name: 'NotificationService' + this.id };
        this.notificationRepository =
            this.options.notificationRepository || (new NotificationMemoryRepository() as any);
    }

    public static createService(options?: NotificationServiceOptions): NotificationService;
    public static createService(bpmsEngine?: BpmsEngine, options?: NotificationServiceOptions): NotificationService;
    public static createService(
        arg1?: BpmsEngine | NotificationServiceOptions,
        arg2?: NotificationServiceOptions,
    ): NotificationService {
        if (arg1 instanceof BpmsEngine) {
            return new NotificationService(arg1, arg2);
        }
        return new NotificationService(undefined, arg1);
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
        return this.notificationRepository.clear();
    }

    public async create(entity: T): Promise<T> {
        return this.notificationRepository.create(entity);
    }
    public async remove(entityId: string): Promise<boolean> {
        return this.notificationRepository.delete(entityId);
    }

    public async find(entityId: string): Promise<T | null> {
        return this.notificationRepository.find(entityId);
    }
    public async list<R = T>(filter?: FilterExpression): Promise<R[]> {
        return this.notificationRepository.findAll(filter);
    }
    public async count(filter?: FilterExpression): Promise<number> {
        return this.notificationRepository.count('id', filter);
    }
    public async query<R>(options: QueryOptions): Promise<QueryResult<R>> {
        return this.notificationRepository.query(options);
    }
    public async scalar(options: ScalarOptions): Promise<number> {
        return this.notificationRepository.scalar(options);
    }
}
