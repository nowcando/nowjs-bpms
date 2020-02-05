import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { OrganizationPositionRepository, OrganizationPositionMemoryRepository } from './OrganizationPositionRepository';
import {
    OrganizationEmployeePositionRepository,
    OrganizationEmployeePositionMemoryRepository,
} from './OrganizationEmployeePositionRepository';
import { OrganizationEmployeeRepository, OrganizationEmployeeMemoryRepository } from './OrganizationEmployeeRepository';
import { IdExpression, FilterExpression } from '../data/Repository';
import { BpmsIdentityUser } from '../identity/IdentityService';
export interface BpmsOrganizationEmployee {
    id: string;
    username?: string;
    name: string;
}
export interface BpmsOrganizationPosition {
    id: string;
    name: string;
    parentId?: string;
}
export interface BpmsOrganizationEmployeePosition {
    id: string;
    positionId: string;
    employeeId: string;
    managerId?: string;
}
export interface OrganizationServiceOptions {
    organizationPositionRepository?: OrganizationPositionRepository;
    organizationEmployeePositionRepository?: OrganizationEmployeePositionRepository;
    organizationEmployeeRepository?: OrganizationEmployeeRepository;
    name: string;
}
export class OrganizationService {
    private organizationPositionRepository: OrganizationPositionRepository;
    private organizationEmployeePositionRepository: OrganizationEmployeePositionRepository;
    private organizationEmployeeRepository: OrganizationEmployeeRepository;
    private id: string = uuidv1();
    private options: OrganizationServiceOptions;
    constructor(private bpmsEngine?: BpmsEngine, options?: OrganizationServiceOptions) {
        this.options = options || { name: 'OrganizationService' + this.id };
        this.organizationPositionRepository =
            this.options.organizationPositionRepository || new OrganizationPositionMemoryRepository();
        this.organizationEmployeeRepository =
            this.options.organizationEmployeeRepository || new OrganizationEmployeeMemoryRepository();
        this.organizationEmployeePositionRepository =
            this.options.organizationEmployeePositionRepository || new OrganizationEmployeePositionMemoryRepository();
    }

    public static createService(options?: OrganizationServiceOptions): OrganizationService;
    public static createService(bpmsEngine?: BpmsEngine, options?: OrganizationServiceOptions): OrganizationService;
    public static createService(
        arg1?: BpmsEngine | OrganizationServiceOptions,
        arg2?: OrganizationServiceOptions,
    ): OrganizationService {
        if (arg1 instanceof BpmsEngine) {
            return new OrganizationService(arg1, arg2);
        }
        return new OrganizationService(undefined, arg1);
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

    public async getOrganizationPosition(positionId: IdExpression): Promise<BpmsOrganizationPosition | null> {
        return this.organizationPositionRepository.find(positionId);
    }
    public async getOrganizationEmployeePosition(
        employeeId: IdExpression,
        positionId: IdExpression,
    ): Promise<BpmsOrganizationEmployeePosition | null> {
        return this.organizationEmployeePositionRepository.find({ employeeId, positionId });
    }
    public async getOrganizationEmployee(employeeId: IdExpression): Promise<BpmsOrganizationEmployee | null> {
        return this.organizationEmployeeRepository.find(employeeId);
    }
    public async getOrganizationEmployeeUser(employeeId: IdExpression): Promise<BpmsIdentityUser | null> {
        const e = await this.organizationEmployeeRepository.find(employeeId);
        if (e && e.username) {
            const r = await this.bpmsEngine?.IdentityService.getUserByUsername(e.username);
            return r as any;
        }
        return null;
    }
    public async getOrganizationEmployees(filter?: FilterExpression): Promise<BpmsOrganizationEmployee[] | null> {
        return this.organizationEmployeeRepository.findAll(filter);
    }
    public async getOrganizationPositions(filter?: FilterExpression): Promise<BpmsOrganizationPosition[] | null> {
        return this.organizationPositionRepository.findAll(filter);
    }
    public async getOrganizationEmployeePositions(
        filter?: FilterExpression,
    ): Promise<BpmsOrganizationEmployeePosition[] | null> {
        return this.organizationEmployeePositionRepository.findAll(filter);
    }
}
