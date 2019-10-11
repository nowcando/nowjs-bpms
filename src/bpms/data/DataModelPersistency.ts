export interface DataModelListOptions {
  name?: string;
}

export interface DataModelFindOptions {
  name?: string;
}

export interface DataModelLoadOptions {
  name: string;
}
export interface DataModelRemoveOptions {
  name: string;
}
export interface DataModelPersistOptions {
  name: string;

  definitions: any;
}
export interface DataModelPersistedData {
  name: string;
  definitions: any;

  persistedAt: Date;
}
export interface DataModelPersistency {
  count(): Promise<number>;
  list<R extends DataModelPersistedData>(
    options?: DataModelListOptions,
  ): Promise<R[]>;
  find<R extends DataModelPersistedData>(
    options: DataModelFindOptions,
  ): Promise<R | null>;
  load<R extends DataModelPersistedData>(
    options: DataModelLoadOptions,
  ): Promise<R[]>;
  persist(options: DataModelPersistOptions): Promise<boolean>;
  remove(options: DataModelRemoveOptions): Promise<boolean>;
  clear(): Promise<void>;
}

export class DataModelMemoryPersistent implements DataModelPersistency {
  private store: DataModelPersistedData[] = [];

  public async clear(): Promise<void> {
    this.store = [];
  }
  public async remove(options: DataModelRemoveOptions): Promise<boolean> {
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
  public async list<R extends DataModelPersistedData>(
    options?: DataModelListOptions | undefined,
  ): Promise<R[]> {
    if (options) {
      const f = this.store.filter((xx) => xx.name === options.name);
      return f as any;
    } else {
      return this.store.slice() as any;
    }
  }
  public async find<R extends DataModelPersistedData>(
    options: DataModelFindOptions,
  ): Promise<R | null> {
    if (options) {
      const f = this.store.find((xx) => xx.name === options.name);
      return f as any;
    } else {
      return null;
    }
  }
  public async load<R extends DataModelPersistedData>(
    options: DataModelLoadOptions,
  ): Promise<R[]> {
    if (options) {
      const f = this.store.filter((xx) => xx.name === options.name);
      return f as any;
    } else {
      return this.store.slice() as any;
    }
  }
  public async persist(options: DataModelPersistOptions): Promise<boolean> {
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
