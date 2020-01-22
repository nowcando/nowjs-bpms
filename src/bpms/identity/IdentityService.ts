import { uuidv1 } from 'nowjs-core/lib/utils';
import { BpmsEngine } from '../BpmsEngine';
import { GroupData, IdentityMemoryRepository, IdentityRepository, ProfileData, UserData } from './IdentityRepository';

export interface IdentityServiceOptions {
    identityRepository?: IdentityRepository<UserData, GroupData, ProfileData>;

    name: string;
}

export class IdentityService<
    TUser extends UserData = UserData,
    TGroup extends GroupData = GroupData,
    TProfile extends ProfileData = ProfileData
> {
    private identityRepository: IdentityRepository<TUser, TGroup, TProfile>;
    private options: IdentityServiceOptions;
    private id: string = uuidv1();
    constructor(private bpmsEngine?: BpmsEngine, options?: IdentityServiceOptions) {
        this.options = options || { name: 'IdentityService' + this.id };
        this.identityRepository =
            this.options.identityRepository ||
            (new IdentityMemoryRepository<UserData, GroupData, ProfileData>() as any);
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
    public get IdentityRepository(): IdentityRepository<TUser, TGroup, TProfile> {
        return this.identityRepository;
    }

    public get BpmsEngine(): BpmsEngine | undefined {
        return this.bpmsEngine;
    }
    public async getUserById(userId: string): Promise<UserData> {
        return this.identityRepository.getUserById(userId);
    }
    public async getUserByUsername(username: string): Promise<UserData> {
        return this.identityRepository.getUserByUsername(username);
    }
    public async getUsers(groupId?: string): Promise<UserData[]> {
        return this.identityRepository.getUsers(groupId);
    }
    public async getGroup(groupId: string): Promise<GroupData> {
        return this.identityRepository.getGroup(groupId);
    }
    public async getGroups(): Promise<GroupData[]> {
        return this.identityRepository.getGroups();
    }
    public async getGroupUsers(groupId?: string): Promise<string[]> {
        return this.identityRepository.getGroupUsers(groupId);
    }
    public async getUserGroups(userId?: string): Promise<string[]> {
        return this.identityRepository.getUserGroups(userId);
    }
}
