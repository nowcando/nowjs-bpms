/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmsRepository, BpmsBaseMemoryRepository, IdExpression } from '../data/Repository';

export interface NotificationModel {
    id: string;
    message: string;
    type: string;
    route: string;
    to: string;
    delivered?: boolean;
    deliveredAt: boolean;
    seen?: boolean;
    seenAt?: boolean;
    userId?: IdExpression;
}

export interface NotificationRepository<T extends NotificationModel = NotificationModel> extends BpmsRepository<T> {
    // implement
}

export class NotificationMemoryRepository extends BpmsBaseMemoryRepository<NotificationModel>
    implements NotificationRepository<NotificationModel> {
    constructor() {
        super({
            storageName: 'BpmsNotification',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
            },
        });
    }
}
