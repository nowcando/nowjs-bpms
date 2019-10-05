export interface DmnDefinitionListOptions {
  name?: string;
}

export interface DmnDefinitionFindOptions {
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
export interface DmnDefinitionPersistency {
  count(): Promise<number>;
  list<R extends DmnDefinitionPersistedData>(
    options?: DmnDefinitionListOptions,
  ): Promise<R[]>;
  find<R extends DmnDefinitionPersistedData>(
    options: DmnDefinitionFindOptions,
  ): Promise<R | null>;
  load<R extends DmnDefinitionPersistedData>(
    options: DmnDefinitionLoadOptions,
  ): Promise<R[]>;
  persist(options: DmnDefinitionPersistOptions): Promise<boolean>;
}

export class DmnDefinitionMemoryPersistent implements DmnDefinitionPersistency {
  private store: DmnDefinitionPersistedData[] = [];
  public count(): Promise<number> {
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
  ): Promise<R | null> {
    if (options) {
      const f = this.store.find((xx) => xx.name === options.name);
      return f as any;
    } else {
      return null;
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
