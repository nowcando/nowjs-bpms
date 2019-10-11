export interface UserData {
  id: string;
  username: string;
}
export interface GroupData {
  id: string;
  name: string;
}

export interface ProfileData {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
}

export interface IdentityRepository<
TUser extends UserData = UserData,
TGroup extends GroupData = GroupData,
TProfile extends ProfileData = ProfileData
> {
  getUserById(userId: string): Promise<TUser>;
  getUserByUsername(username: string): Promise<TUser>;
  getUserProfileById(userId: string): Promise<TProfile>;
  getUsers(groupId?: string): Promise<TUser[]>;
  getGroup(groupId: string): Promise<TGroup>;
  getGroups(): Promise<TGroup[]>;
  getGroupUsers(groupId?: string): Promise<string[]>;
  getUserGroups(userId?: string): Promise<string[]>;
}
export class IdentityMemoryRepository<
TUser extends UserData = UserData,
TGroup extends GroupData = GroupData,
TProfile extends ProfileData = ProfileData
>
  implements IdentityRepository<TUser, TGroup, TProfile> {
  private users: UserData[] = [{ id: "11", username: "admin" }];
  private userProfiles: ProfileData[] = [
    { id: "15", userId: "11", firstname: "admin", lastname: "admin" },
  ];
  private userGroups: { [name: string]: string[] } = { admin: ["Admin"] };
  private groups: GroupData[] = [{ id: "16", name: "Admin" }];
  public async getUserById(userId: string): Promise<TUser> {
    const d = this.users.find((xx) => xx.id === userId);
    return Promise.resolve(d as any);
  }
  public async getUserByUsername(username: string): Promise<TUser> {
    const d = this.users.find((xx) => xx.username === username);
    return Promise.resolve(d as any);
  }

  public async getUserProfileById(userId: string): Promise<TProfile> {
    const d = this.userProfiles.find((xx) => xx.userId === userId);
    return Promise.resolve(d as any);
  }
  public async getUsers(groupId?: string): Promise<TUser[]> {
    const users = this.users.slice();
    return Promise.resolve(users as any);
  }
  public async getGroup(groupId: string): Promise<TGroup> {
    const d = this.groups.find((xx) => xx.id === groupId);
    return Promise.resolve(d as any);
  }
  public async getGroups(): Promise<TGroup[]> {
    const groups = this.groups.slice();
    return Promise.resolve(groups as any);
  }
  public async getGroupUsers(groupId?: string): Promise<string[]> {
    const group = this.groups.find((xx) => xx.id === groupId);
    if (group) {
      const entry = Object.entries(this.userGroups).find((xx) =>
        xx[1].includes(group.name),
      );
      if (entry) {
        return entry[1];
      }
    }
    return [];
  }
  public async getUserGroups(userId?: string): Promise<string[]> {
    const entry = Object.keys(this.userGroups)
                        .filter((xx) => xx === userId)
                        .map((xx) => xx);
    if (entry) {
      return entry;
    }

    return [];
  }
}
