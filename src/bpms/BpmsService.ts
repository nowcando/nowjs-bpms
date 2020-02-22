import { BpmsEngine } from './BpmsEngine';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface BpmsService {
    BpmsEngine: BpmsEngine | undefined;
    Id: string;
    Name: string;
}
