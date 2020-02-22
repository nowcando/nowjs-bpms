/* eslint-disable @typescript-eslint/no-empty-interface */
import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { IdentityUserRepository, IdentityUserModel, IdentityUserMemoryRepository } from './IdentityUserRepository';
import { IdentityGroupModel, IdentityGroupRepository, IdentityGroupMemoryRepository } from './IdentityGroupRepository';
import {
    IdentityUserGroupModel,
    IdentityUserGroupRepository,
    IdentityUserGroupMemoryRepository,
} from './IdentityUserGroupRepository';
import {
    IdentityUserClaimMemoryRepository,
    IdentityUserClaimRepository,
    IdentityUserClaimModel,
} from './IdentityUserClaimRepository';
import {
    IdentityResourceRepository,
    IdentityResourceModel,
    IdentityResourceMemoryRepository,
} from './IdentityResourceRepository';
import { IdExpression, FilterExpression } from '../data/Repository';
import { BpmsService } from '../BpmsService';

export interface BpmsIdentityUser {
    id: string;
    name: string;
}
export interface BpmsIdentityGroup {
    id: string;
    name: string;
}
export interface BpmsIdentityResource {
    id: string;
    name: string;
}

export interface BpmsIdentityUserGroup {
    userId: string;
    groupId: string;
}

export interface BpmsIdentityUserClaim extends Record<string, string> {
    // implement
}
export interface IdentityServiceOptions {
    identityUserRepository?: IdentityUserRepository<IdentityUserModel>;
    identityGroupRepository?: IdentityUserRepository<IdentityGroupModel>;
    identityUserGroupRepository?: IdentityUserRepository<IdentityUserGroupModel>;
    identityResourceRepository?: IdentityResourceRepository<IdentityResourceModel>;
    identityUserClaimRepository?: IdentityUserClaimRepository<IdentityUserClaimModel>;
    name: string;
}

export class IdentityService implements BpmsService {
    private identityUserRepository: IdentityUserRepository<IdentityUserModel>;
    private identityGroupRepository: IdentityGroupRepository<IdentityGroupModel>;
    private identityResourceRepository: IdentityResourceRepository<IdentityResourceModel>;
    private identityUserGroupRepository: IdentityUserGroupRepository<IdentityUserGroupModel>;
    private identityUserClaimRepository: IdentityUserClaimRepository<IdentityUserClaimModel>;
    private options: IdentityServiceOptions;
    private id: string = uuidv1();
    constructor(private bpmsEngine?: BpmsEngine, options?: IdentityServiceOptions) {
        this.options = options || { name: 'IdentityService' + this.id };
        this.identityUserRepository =
            this.options.identityUserRepository || (new IdentityUserMemoryRepository() as any);
        this.identityResourceRepository =
            this.options.identityResourceRepository || (new IdentityResourceMemoryRepository() as any);
        this.identityGroupRepository =
            this.options.identityGroupRepository || (new IdentityGroupMemoryRepository() as any);
        this.identityUserGroupRepository =
            this.options.identityUserRepository || (new IdentityUserGroupMemoryRepository() as any);
        this.identityUserClaimRepository =
            this.options.identityUserRepository || (new IdentityUserClaimMemoryRepository() as any);
    }

    public get Id(): string {
        return this.id;
    }

    public get Name(): string {
        return this.options.name;
    }

    public static createService(options?: IdentityServiceOptions): IdentityService;
    public static createService(bpmsEngine?: BpmsEngine, options?: IdentityServiceOptions): IdentityService;
    public static createService(
        arg1?: BpmsEngine | IdentityServiceOptions,
        arg2?: IdentityServiceOptions,
    ): IdentityService {
        if (arg1 instanceof BpmsEngine) {
            return new IdentityService(arg1, arg2);
        }
        return new IdentityService(undefined, arg1);
    }
    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }
    public async getUserById(userId: IdExpression): Promise<BpmsIdentityUser | null> {
        return this.identityUserRepository.find({ id: userId });
    }
    public async getUserByUsername(username: string): Promise<BpmsIdentityUser | null> {
        return this.identityUserRepository.find({ username });
    }
    public async getUsers(filter?: FilterExpression): Promise<BpmsIdentityUser[]> {
        return this.identityUserRepository.findAll(filter);
    }

    public async getGroup(groupId: IdExpression): Promise<BpmsIdentityGroup | null>;
    public async getGroup(filter: FilterExpression): Promise<BpmsIdentityGroup | null>;
    public async getGroup(expression: IdExpression | FilterExpression): Promise<BpmsIdentityGroup | null> {
        return this.identityGroupRepository.find(expression);
    }

    public async getGroups(filter?: FilterExpression): Promise<BpmsIdentityGroup[]> {
        return this.identityGroupRepository.findAll(filter);
    }

    public async getGroupUsers(groupId?: IdExpression): Promise<string[]> {
        return this.identityUserGroupRepository.findAll({ groupId: groupId });
    }
    public async getUserGroups(userId?: IdExpression): Promise<string[]> {
        return this.identityUserGroupRepository.findAll({ userId: userId });
    }

    public async getResources(filter?: FilterExpression): Promise<BpmsIdentityResource[]> {
        return this.identityResourceRepository.findAll(filter);
    }

    public async getResourceUsers(resourceId?: IdExpression): Promise<string[]> {
        return this.identityUserClaimRepository.findAll({ resourceId: resourceId });
    }
    public async getUserResources(userId?: IdExpression): Promise<string[]> {
        return this.identityUserClaimRepository.findAll({ userId: userId });
    }
}
