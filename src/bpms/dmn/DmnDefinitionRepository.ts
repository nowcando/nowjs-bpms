export interface DmnDefinitionListOptions {
  name?: string;
}

export interface DmnDefinitionFindOptions {
  name?: string;
}

export interface DmnDefinitionRemoveOptions {
  name?: string;
}

export interface DmnDefinitionLoadOptions {
  name: string;
}
export interface DmnDefinitionPersistOptions {
  name: string;

  definitions: any;
}
export interface DmnDefinitionPersistedData {
  name: string;
  definitions: any;

  persistedAt: Date;
}
export interface DmnDefinitionRepository {
  count(): Promise<number>;

  list<R extends DmnDefinitionPersistedData>(
    options?: DmnDefinitionListOptions,
  ): Promise<R[]>;
  find<R extends DmnDefinitionPersistedData>(
    options: DmnDefinitionFindOptions,
  ): Promise<R | undefined>;
  load<R extends DmnDefinitionPersistedData>(
    options: DmnDefinitionLoadOptions,
  ): Promise<R[]>;
  persist(options: DmnDefinitionPersistOptions): Promise<boolean>;

  remove(options: DmnDefinitionRemoveOptions): Promise<boolean>;
  clear(): Promise<void>;
}

export class DmnDefinitionMemoryRepository implements DmnDefinitionRepository {

  private store: DmnDefinitionPersistedData[] = [];

  public async clear(): Promise<void> {
    this.store = [];
  }
  public async remove(options: DmnDefinitionRemoveOptions): Promise<boolean> {
    const f = this.store.findIndex((xx) => xx.name === options.name);
    if (f >= 0) {
      this.store.splice(f, 1);
      return true;
    }
    return false;
  }
  public async count(): Promise<number> {
    return Promise.resolve(this.store.length);
  }
  public async list<R extends DmnDefinitionPersistedData>(
    options?: DmnDefinitionListOptions | undefined,
  ): Promise<R[]> {
    if (options) {
      const f = this.store.filter((xx) => xx.name === options.name);
      return f as any;
    } else {
      return this.store.slice() as any;
    }
  }
  public async find<R extends DmnDefinitionPersistedData>(
    options: DmnDefinitionFindOptions,
  ): Promise<R | undefined> {
    if (options) {
      const f = this.store.find((xx) => xx.name === options.name);
      return f as any;
    } else {
      return undefined;
    }
  }
  public async load<R extends DmnDefinitionPersistedData>(
    options: DmnDefinitionLoadOptions,
  ): Promise<R[]> {
    if (options) {
      const f = this.store.filter((xx) => xx.name === options.name);
      return f as any;
    } else {
      return this.store.slice() as any;
    }
  }
  public async persist(options: DmnDefinitionPersistOptions): Promise<boolean> {
    const ix = this.store.findIndex((xx) => xx.name === options.name);
    if (ix) {
      this.store.splice(ix, 1);
    }
    this.store.push({
      name: options.name,
      persistedAt: new Date(),
      definitions: options.definitions,
    });
    return true;
  }
}
