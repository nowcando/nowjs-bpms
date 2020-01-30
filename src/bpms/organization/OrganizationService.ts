import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { OrganizationPositionRepository, OrganizationPositionMemoryRepository } from './OrganizationPositionRepository';
import {
    OrganizationEmployeePositionRepository,
    OrganizationEmployeePositionMemoryRepository,
} from './OrganizationEmployeePositionRepository';
import { OrganizationEmployeeRepository, OrganizationEmployeeMemoryRepository } from './OrganizationEmployeeRepository';
import { IdExpression, FilterExpression } from '../data/Repository';
export interface OrganizationEmployee {
    id: string;
    name: string;
}
export interface OrganizationPosition {
    id: string;
    name: string;
    parentId?: string;
}
export interface OrganizationEmployeePosition {
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

    public async getOrganizationPosition(positionId: IdExpression): Promise<OrganizationPosition | null> {
        return this.organizationPositionRepository.find(positionId);
    }
    public async getOrganizationEmployeePosition(
        employeeId: IdExpression,
        positionId: IdExpression,
    ): Promise<OrganizationEmployeePosition | null> {
        return this.organizationEmployeePositionRepository.find({ employeeId, positionId });
    }
    public async getOrganizationEmployee(employeeId: IdExpression): Promise<OrganizationEmployee | null> {
        return this.organizationEmployeeRepository.find(employeeId);
    }
    public async getOrganizationEmployees(filter?: FilterExpression): Promise<OrganizationEmployee[] | null> {
        return this.organizationEmployeeRepository.findAll(filter);
    }
    public async getOrganizationPositions(filter?: FilterExpression): Promise<OrganizationPosition[] | null> {
        return this.organizationPositionRepository.findAll(filter);
    }
    public async getOrganizationEmployeePositions(
        filter?: FilterExpression,
    ): Promise<OrganizationEmployeePosition[] | null> {
        return this.organizationEmployeePositionRepository.findAll(filter);
    }
}
