export interface BpmnDefinitionListOptions {
  name?: string;
}

export interface BpmnDefinitionFindOptions {
  name?: string;
}

export interface BpmnDefinitionLoadOptions {
  name: string;
}
export interface BpmnDefinitionRemoveOptions {
  name: string;
}
export interface BpmnDefinitionPersistOptions {
  name: string;

  definitions: any;
}
export interface BpmnDefinitionPersistedData {
  name: string;
  definitions: any;

  persistedAt: Date;
}
export interface BpmnDefinitionPersistency {
  count(): Promise<number>;
  list<R extends BpmnDefinitionPersistedData>(
    options?: BpmnDefinitionListOptions,
  ): Promise<R[]>;
  find<R extends BpmnDefinitionPersistedData>(
    options: BpmnDefinitionFindOptions,
  ): Promise<R |  null>;
  load<R extends BpmnDefinitionPersistedData>(
    options: BpmnDefinitionLoadOptions,
  ): Promise<R[]>;
  persist(options: BpmnDefinitionPersistOptions): Promise<boolean>;
  remove(options: BpmnDefinitionRemoveOptions): Promise<boolean>;
  clear(): Promise<void>;
}

export class BpmnDefinitionMemoryPersistent
  implements BpmnDefinitionPersistency {
  private store: BpmnDefinitionPersistedData[] = [];

  public async clear(): Promise<void> {
    this.store = [];
  }
  public async remove(options: BpmnDefinitionRemoveOptions): Promise<boolean> {
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
  public async list<R extends BpmnDefinitionPersistedData>(
    options?: BpmnDefinitionListOptions | undefined,
  ): Promise<R[]> {
    if (options) {
      const f = this.store.filter((xx) => xx.name === options.name);
      return f as any;
    } else {
      return this.store.slice() as any;
    }
  }
  public async find<R extends BpmnDefinitionPersistedData>(
    options: BpmnDefinitionFindOptions,
  ): Promise<R | null> {
    if (options) {
      const f = this.store.find((xx) => xx.name === options.name);
      return f as any;
    } else {
      return null;
    }
  }
  public async load<R extends BpmnDefinitionPersistedData>(
    options: BpmnDefinitionLoadOptions,
  ): Promise<R[]> {
    if (options) {
      const f = this.store.filter((xx) => xx.name === options.name);
      return f as any;
    } else {
      return this.store.slice() as any;
    }
  }
  public async persist(
    options: BpmnDefinitionPersistOptions,
  ): Promise<boolean> {
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
