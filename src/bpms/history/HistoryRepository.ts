/* eslint-disable @typescript-eslint/no-unused-vars */
export interface HistoryData {
    id?: string;
    createdAt?: string;
    source?: string;
    tenantId: string;
    userId: string;

    type?: string;
}

export interface HistoryRepository<T extends HistoryData = HistoryData> {
    createEntry(data: HistoryData): Promise<T>;
    removeEntry(entryId: string): Promise<boolean>;
    // tslint:disable:unified-signatures
    removeEntry(data: T): Promise<boolean>;
    removeEntry(arg1: string | T): Promise<boolean>;
    findEntry(): Promise<T>;
    findEntries(): Promise<T[]>;
    count(): Promise<number>;
    query(): Promise<T[]>;
}
export class HistoryMemoryRepository implements HistoryRepository<HistoryData> {
    private entries: any[] = [];
    public async createEntry(data: HistoryData): Promise<HistoryData> {
        this.entries.push(data);
        return data;
    }
    public async removeEntry(entryId: string): Promise<boolean>;
    public async removeEntry(data: HistoryData): Promise<boolean>;
    public async removeEntry(arg1: string | HistoryData): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public async findEntry(): Promise<HistoryData> {
        throw new Error("Method not implemented.");
    }
    public async findEntries(): Promise<HistoryData[]> {
        throw new Error("Method not implemented.");
    }
    public async count(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public async query(): Promise<HistoryData[]> {
        throw new Error("Method not implemented.");
    }
}
