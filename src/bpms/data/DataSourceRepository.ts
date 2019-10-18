export interface DataSourceListOptions {
    name?: string;
  }

export interface DataSourceFindOptions {
    name?: string;
  }

export interface DataSourceLoadOptions {
    name: string;
  }
export interface DataSourceRemoveOptions {
    name: string;
  }
export interface DataSourcePersistOptions {
    name: string;

    definitions: any;
  }
export interface DataSourcePersistedData {
    name: string;
    definitions: any;

    persistedAt: Date;
  }
export interface DataSourceRepository {
    count(): Promise<number>;
    list<R extends DataSourcePersistedData>(
      options?: DataSourceListOptions,
    ): Promise<R[]>;
    find<R extends DataSourcePersistedData>(
      options: DataSourceFindOptions,
    ): Promise<R | null>;
    load<R extends DataSourcePersistedData>(
      options: DataSourceLoadOptions,
    ): Promise<R[]>;
    persist(options: DataSourcePersistOptions): Promise<boolean>;
    remove(options: DataSourceRemoveOptions): Promise<boolean>;
    clear(): Promise<void>;
  }

export class DataSourceMemoryRepository implements DataSourceRepository {
    private store: DataSourcePersistedData[] = [];

    public async clear(): Promise<void> {
      this.store = [];
    }
    public async remove(options: DataSourceRemoveOptions): Promise<boolean> {
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
    public async list<R extends DataSourcePersistedData>(
      options?: DataSourceListOptions | undefined,
    ): Promise<R[]> {
      if (options) {
        const f = this.store.filter((xx) => xx.name === options.name);
        return f as any;
      } else {
        return this.store.slice() as any;
      }
    }
    public async find<R extends DataSourcePersistedData>(
      options: DataSourceFindOptions,
    ): Promise<R | null> {
      if (options) {
        const f = this.store.find((xx) => xx.name === options.name);
        return f as any;
      } else {
        return null;
      }
    }
    public async load<R extends DataSourcePersistedData>(
      options: DataSourceLoadOptions,
    ): Promise<R[]> {
      if (options) {
        const f = this.store.filter((xx) => xx.name === options.name);
        return f as any;
      } else {
        return this.store.slice() as any;
      }
    }
    public async persist(options: DataSourcePersistOptions): Promise<boolean> {
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

