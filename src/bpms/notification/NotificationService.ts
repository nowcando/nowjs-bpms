/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { QueryOptions, QueryResult, ScalarOptions } from '../data/Repository';
import { NotificationRepository, NotificationMemoryRepository } from './NotificationRepository';

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

export class NotificationService<T extends BpmsNotification = BpmsNotification> {
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

    public async registerNotification(notifiation: T): Promise<any> {
        const d = { ...notifiation };
        this.notificationRepository.create(d);
        return d;
    }
    public async find(processName: string, viewName: string): Promise<any> {
        return this.notificationRepository.find(xx => xx.name === viewName);
    }
    public async list(): Promise<any[]> {
        return this.notificationRepository.findAll();
    }
}
