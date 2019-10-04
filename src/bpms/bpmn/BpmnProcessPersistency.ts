export interface BpmnProcessListOptions {
  id?: string | string[];
  name?: string | string[];
  state?: string;
}

export interface BpmnPersistentFindOptions {
  id?: string | string[];
  name?: string | string[];
  state?: string;
}
export interface BpmnProcessLoadOptions {
  id?: string;
  name?: string;
  state?: string;
}

export interface BpmnProcessPersistOptions {
  id: string;
  name: string;
  data: any;
}

export interface BpmnProcessPersistedData {
  id: string;
  name: string;
  persistedAt: Date;
  data: any;
}

export interface BpmnProcessPersistency {

  count(): Promise<number> ;
  list<R extends BpmnProcessPersistedData>(
    options?: BpmnProcessListOptions,
  ): Promise<R[]>;
  find<R extends BpmnProcessPersistedData>(
    options: BpmnPersistentFindOptions,
  ): Promise<R[]>;
  load<R extends BpmnProcessPersistedData>(
    options: BpmnProcessLoadOptions,
  ): Promise<R[]>;
  persist(options: BpmnProcessPersistOptions): Promise<boolean>;
}
export class BpmnProcessMemoryPersistent implements BpmnProcessPersistency {

  private store: BpmnProcessPersistedData[] = [];

  public count(): Promise<number> {
    return Promise.resolve(this.store.length);
  }

  public list<R extends BpmnProcessPersistedData>(
    options?: BpmnProcessListOptions | undefined,
  ): Promise<R[]> {
    const f = options && (options.id || options.name || options.state)
      ? this.store.filter(
          (xx) =>
            (xx.id && xx.id === options.id) ||
            (xx.name && xx.name === options.name),
        )
      : this.store.slice();
    return Promise.resolve(f as any);
  }
  public find<R extends BpmnProcessPersistedData>(
    options: BpmnPersistentFindOptions,
  ): Promise<R[]> {
    const f = this.store.filter(
      (xx) =>
        (xx.id && xx.id === options.id) || (xx.name && xx.name === options.name),
    );
    return Promise.resolve(f as any);
  }
  public load<R extends BpmnProcessPersistedData>(
    options: BpmnProcessLoadOptions,
  ): Promise<R[]> {
    const f = this.store.filter(
      (xx) =>
        (xx.id && xx.id === options.id) || (xx.name && xx.name === options.name),
    );
    const d = f.map((xx) => {
      return { ...xx, data: JSON.parse(xx.data) , persistedAt: new Date(xx.persistedAt) };
    });
    return Promise.resolve(d as any[]);
  }
  public persist(options: BpmnProcessPersistOptions): Promise<boolean> {
    const ix = this.store.findIndex(
      (xx) => xx.id === options.id || xx.name === options.name,
    );
    if (ix >= 0) {
      this.store.splice(ix, 1);
    }
    this.store.push({
      id: options.id,
      name: options.name,
      data: JSON.stringify(options.data),
      persistedAt: new Date(),
    });
    return Promise.resolve(true);
  }
}



