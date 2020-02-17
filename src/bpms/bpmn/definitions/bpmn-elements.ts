import { EventEmitter } from 'events';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface BpmnLogger {
    debug(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
}

export interface BpmnRecordAny extends Record<string, any> {}
export interface BpmnMessage extends BpmnRecordAny {
    fields?: BpmnFields;
    content?: BpmnContent;
    properties?: BpmnProperties;
}

export interface BpmnBehaviour extends BpmnRecordAny {
    id: string;
    type: string;
    execute<M extends BpmnMessage = BpmnApiMessage, R = void>(executeMessage?: M): R;
}
export interface BpmnActivityBehaviour extends BpmnBehaviour {}
export interface BpmnLoopCharacteristicsBehaviour extends BpmnBehaviour {}
export interface BpmnTaskBehaviour extends BpmnActivityBehaviour {
    loopCharacteristics: BpmnLoopCharacteristicsBehaviour;
}
export interface BpmnProcessBehaviour extends BpmnBehaviour {}
export interface BpmnFlowBehaviour extends BpmnBehaviour {}
// export interface BpmnExecutionEventMessageContent {
//     id: string;
//     type: string;
//     executionId: string;
//     parent?: BpmnExecutionEventMessageContent;
//     path?: BpmnExecutionEventMessageContent[];
// }
export interface BpmnProcessExecutionDefinition {
    state: 'pending' | 'running' | 'completed';
    run(callback?: any): void;
    resume(callback?: any): void;

    recover(state?: any): void;

    sendMessage<M extends BpmnMessage = BpmnApiMessage>(message: M): void;

    executionId: string;
    execution: BpmnProcessExecution;
    getProcesses(): BpmnProcess[];

    getExecutableProcesses(): BpmnProcess[];
    getApi<M extends BpmnMessage = BpmnApiMessage>(message?: M): BpmnApi<any>;
    getElementById<E extends BpmnElement = BpmnElement>(elementId: string): E;
    getActivityById(childId: string): BpmnActivity;
    environment: BpmnEnvironment;
    status: string;
    stopped: boolean;
    type: string;
    signal<M extends BpmnMessage = BpmnApiMessage>(message?: M): void;
    broker: BpmnDefinitionBroker;
    id: string;
    isRunning: boolean;
    name: string;
    logger: BpmnLogger;
    waitFor<R>(name: string, onMessage?: OnMessageCallback): Promise<R>;
}
export interface BpmnProcessExecutionDefinitionState {
    state: 'pending' | 'running' | 'completed';
    processes: {
        [processId: string]: {
            variables: any;
            services: any;
            children: BpmnProcessExecutionState[];
        };
    };
}

export interface BpmnProcessExecutionState {
    name: string;
    state: BpmnProcessExecutionStatus;
    stopped: boolean;
    engineVersion: string;
    environment: BpmnEnvironment;
    definitions: BpmnProcessExecutionDefinitionState[];

    entered: boolean;
}

export interface BpmnElement {
    readonly id: string;
    readonly type: string;
    readonly name: string;
}
export interface BpmnActivity extends BpmnElement, BpmnActivityApi {}
export interface BpmnFlow extends BpmnElement, BpmnFlowApi {}
export interface BpmnDefinition extends BpmnDefinitionApi {}

export interface BpmnBroker<W = any> {
    new (owner: W);
    owner: W;
    dismiss(onMessage?: OnMessageCallback): void;
    subscribeTmp(exchangeName: string, pattern: string, onMessage?: any, options?: BpmnRecordAny): any;
    subscribeOnce(exchangeName: string, pattern: string, onMessage?: any, options?: BpmnRecordAny): any;
    unsubscribe(queueName: string, onMessage: any): void;
    assertExchange(exchangeName: string, type?: string, options?: BpmnRecordAny): void;
    deleteExchange(exchangeName: string, ifUnused?: boolean): void;
    bindExchange(source: string, destination: string, pattern?: any, ...args: any[]): void;
    unbindExchange(source: string, destination: string, pattern?: any): any;

    publish(exchangeName: string, routingKey: string, content?: any, options?: BpmnRecordAny): void;
    close(): void;

    assertQueue(
        queueName: string,
        options?: { durable?: boolean; autoDelete?: boolean; deadLetterExchange?: string },
    ): void;
    bindQueue(queueName: string, exchangeName: string, pattern: string, options?: BpmnRecordAny): void;
    unbindQueue(queueName: string, exchangeName: string, pattern: string): void;
    consume(queueName: string, onMessage: any, options?: BpmnRecordAny): void;
    cancel(consumerTag: string): void;
    createQueue(): any;
    deleteQueue(queueName: string, options?: { ifUnused: boolean; ifEmpty?: boolean }): void;
    getExchange(exchangeName: string): any;
    getQueue(queueName: string): any;
    getState<S>(): S;
    recover<S>(state: S): any;
    purgeQueue(queueName: string): void;
    sendToQueue(queueName: string, content?: any, options?: BpmnRecordAny): void;
    stop(): void;
    reset(): void;
    get(queueName: string, options?: any): any;
    ack(message: any, allUpTo?: boolean): void;
    ackAll(): void;
    nack(message: any, allUpTo?: boolean, requeue?: boolean): void;
    nackAll(): void;
    prefetch(count: boolean): void;
    peek(ignoreDelivered?: boolean): any;
    emit(eventName: string, content?: any): void;
    reject(requeue?: boolean): void;
    reject(message: any, requeue?: boolean): void;
    unbindConsumer(): void;
    on(eventName: string, handler: Function): void;
    once(eventName: string, handler: Function): void;
    off(eventName: string, handler: Function): void;
    createShovel(name: string, source: string, destination: string, options?: any): any;
    getShovel(name: string): any;
    closeShovel(name: string): void;
}
export interface BpmnActivityBroker extends BpmnExecutionBroker<BpmnActivity> {}
export interface BpmnProcessBroker extends BpmnExecutionBroker<BpmnProcess> {}
export interface BpmnMessageFlowBroker extends BpmnEventBroker<BpmnFlow> {}
export interface BpmnDefinitionBroker extends BpmnEventBroker<BpmnDefinition> {}
export interface BpmnExecutionBroker<W = any> extends BpmnEventBroker<W> {}
export interface BpmnEventBroker<W = any> extends BpmnBroker<W> {
    new (brokerOwner: W, options?: BpmnRecordAny, onBrokerReturn?: (message?: any) => void);
    broker: BpmnBroker<W>;
    eventPrefix: string;

    on<M = W, R = any>(
        eventName: string,
        callback: (message: M) => void,
        eventOptions?: { once?: boolean } & BpmnRecordAny,
    ): R;
    once<M = W, R = any>(eventName: string, callback: (message: M) => void, eventOptions?: BpmnRecordAny): R;
    waitFor<R>(eventName: string, onMessage?: OnMessageCallback): Promise<R>;
    emit<C = BpmnRecordAny, P = BpmnContent>(eventName: string, content?: C, props?: P): void;
    emitFatal<E = Error | string, C = BpmnContent>(error: E, content?: C): void;
}
export interface BpmnBrokerState {}

export interface BpmnState {
    settings: BpmnSettings;
    variables: BpmnVariables;
    output: BpmnApiOutput;
}

export interface BpmnEnvironmentState {
    settings: BpmnSettings;
    variables: BpmnVariables;
    output: BpmnApiOutput;
}

// export function cloneContent(content, extend) {}
// export function cloneMessage(message, overrideContent) {}
// export function cloneParent(parent) {}
// export function unshiftParent(parent, adoptingParent) {}
// export function pushParent(parent, ancestor) {}

export interface BpmnDataObject extends BpmnElement {}
export interface BpmnAssociation extends BpmnElement {}
export interface BpmnSequenceFlow extends BpmnFlow, BpmnSequenceFlowApi {}
export interface BpmnMessageFlow extends BpmnFlow, BpmnMessageFlowApi {}

export interface BpmnExtention {
    activate<M extends BpmnMessage = BpmnApiMessage>(message?: M): void;
    deactivate<M extends BpmnMessage = BpmnApiMessage>(message?: M): void;
}
export interface BpmnApiExecutionContext {
    id: string;
    name: string;
    type: string;
    sid: string;
    definitionContext: BpmnProcessExecutionDefinition;
    environment: BpmnEnvironment;
    clone(): BpmnApiExecutionContext;
    getActivities(): BpmnActivity[];
    getActivityById(activityId: string): BpmnActivity;
    getAssociations(): BpmnAssociation[];
    getExecutableProcesses(): BpmnProcess[];
    getDataObjectById(id: string): BpmnDataObject;
    getInboundAssociations(): BpmnAssociation[];
    getInboundSequenceFlows(): BpmnSequenceFlow[];
    getMessageFlows(): BpmnMessageFlow;
    getOutboundSequenceFlows(): BpmnSequenceFlow[];
    getOutboundAssociations(): BpmnAssociation[];
    getProcessById(processId: string): BpmnProcess;
    getProcesses(): BpmnProcess[];
    getSequenceFlowById(id: string): BpmnSequenceFlow;
    getSequenceFlows(): BpmnSequenceFlow[];
    getStartActivities(): BpmnActivity[];
    loadExtensions(activity: BpmnActivity): BpmnExtentions;
}
export interface BpmnExpressions {
    resolveExpression: BpmnResolveExpression;
    isExpression(text: string): boolean;
    hasExpression(text: string): boolean;
}
export type BpmnCallback<R, Z = void> = (err: Error, result: R) => Z;
export interface BpmnScript {
    execute<R, Z = void>(executionContext: BpmnApiExecutionContext, callback?: BpmnCallback<R>): Z;
}
export interface BpmnScript {
    getScript(scriptType: string, activity: BpmnActivityApi): BpmnScript;
    register(activity: BpmnActivityApi): void;
}

export interface BpmnServices extends Record<string, BpmnService> {}

export interface BpmnService {
    <M = any, C = any, R = void>(executionMessage: M, callback: BpmnCallback<C>): R;
    <M = any, C = any, R = void>(...args: any[]): (executionMessage: M, callback: BpmnCallback<C>) => R;
}
export interface BpmnSettings extends BpmnRecordAny {}
export interface BpmnApiExpression {}
export type BpmnResolveExpression = <E = string>(expression: string, apiMessage?: BpmnApiMessage, owner?: any) => E;
export interface BpmnVariables<E = any> extends Record<string, E> {}
export interface BpmnApiOutput<E = any> extends Record<string, E> {}
export interface BpmnApiMessage extends BpmnMessage {}
export interface BpmnApiExtention {
    <E extends BpmnElement = BpmnActivity, R = void>(element: E, context: BpmnProcess): R;
    <R = void>(...args: any[]): R;
}
export interface BpmnExtentions extends Record<string, BpmnApiExtention> {}
export interface BpmnEnvironmentOptions extends BpmnRecordAny {}
export interface BpmnEnvironment {
    options: BpmnEnvironmentOptions;
    expressions: BpmnApiExpression[];
    extensions: Record<string, BpmnExtentions>;
    output: BpmnApiOutput;
    scripts: Record<string, BpmnScript>;
    services: Record<string, BpmnService>;
    settings: BpmnSettings;
    variables: BpmnVariables;
    addService(name: string, fn: BpmnService): void;
    assignVariables(newVars: BpmnVariables): void;
    clone(): BpmnEnvironment;
    getScript(...args: any[]): BpmnScript;
    getServiceByName(serviceName: string): BpmnService;
    getState(): BpmnEnvironmentState;
    registerScript(...args: any[]): void;
    resolveExpression: BpmnResolveExpression;
    recover(state: BpmnState): BpmnEnvironment;
    Logger: BpmnLogger;
}

export interface BpmnFields extends BpmnRecordAny {}

export interface BpmnContent extends BpmnRecordAny {}
export interface BpmnProperties extends BpmnRecordAny {}

export type BpmnElementType =
    | 'activity'
    | 'process'
    | 'flow'
    | 'association'
    | 'sequenceflow'
    | 'message'
    | 'defnition';
export interface BpmnApi<T> {
    readonly id: string;
    // type: BpmnElementType;
    readonly name: string;
    readonly executionId: string;
    readonly environment: BpmnEnvironment;
    readonly fields: BpmnFields;
    readonly content: BpmnContent;
    readonly messageProperties: BpmnProperties;
    readonly owner: any;
    cancel(): void;
    discard(): void;
    signal<M extends BpmnMessage = BpmnApiMessage, P = BpmnRecordAny>(message?: M, options?: P): void;
    stop(): void;
    resolveExpression(expression: string): string;
    sendApiMessage(action: string, content: BpmnContent, options?: BpmnRecordAny): void;
    createMessage<C extends BpmnContent, R = C>(content?: C): R;
    getPostponed(...args: any[]): BpmnElement[];
}

export interface BpmnFlowApi extends BpmnApi<BpmnFlow> {
    readonly id: string;
    readonly name: string;
    readonly parent: BpmnElement;
    readonly behaviour: BpmnFlowBehaviour;
}
export interface BpmnMessageFlowApi extends BpmnApi<BpmnMessageFlow> {
    readonly id: string;
    readonly type: 'message' | string;
    readonly name: string;
    readonly broker: BpmnMessageFlowBroker;
    readonly parent: BpmnElement;
    readonly behaviour: BpmnFlowBehaviour;
    readonly source: string;
    readonly target: string;
    readonly environment: BpmnEnvironment;
    readonly counters: BpmnCounter;
    on: BpmnMessageFlowBroker['on'];
    once: BpmnMessageFlowBroker['once'];
    emit: BpmnMessageFlowBroker['emit'];
    waitFor: BpmnMessageFlowBroker['waitFor'];
    discard(): void;
    activate(): void;
    deactivate(): void;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message?: M): BpmnMessageFlowApi;
    getState(): BpmnFlowState;
    recover<S>(state: S): void;
    resume(): void;
    stop(): void;
}

export interface BpmnSequenceFlowApi extends BpmnApi<BpmnSequenceFlow> {
    readonly id: string;
    readonly type: 'sequenceflow' | string;
    readonly name: string;
    readonly broker: BpmnMessageFlowBroker;
    readonly parent: BpmnElement;
    readonly behaviour: BpmnFlowBehaviour;
    readonly sourceId: string;
    readonly targetId: string;
    readonly isDefault: boolean;
    readonly isSequenceFlow: true;
    readonly environment: BpmnEnvironment;
    readonly counters: BpmnCounter;
    on: BpmnMessageFlowBroker['on'];
    once: BpmnMessageFlowBroker['once'];
    waitFor: BpmnMessageFlowBroker['waitFor'];
    discard(): void;
    evaluateCondition<M extends BpmnMessage = BpmnApiMessage>(
        message: M,
        onEvaluateError: (...args: any[]) => void,
    ): void;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message?: M): BpmnSequenceFlowApi;
    getCondition(): string;
    getState(): BpmnFlowState;
    preFlight(action: string): string;
    recover<S>(state: S): void;
    shake(): void;
    stop(): void;
    take<C>(content: C): void;
}

export interface BpmnProcessApi {
    readonly broker: BpmnProcessBroker;
    on: BpmnProcessBroker['on'];
    once: BpmnProcessBroker['once'];
    waitFor: BpmnProcessBroker['waitFor'];
    readonly extensions: BpmnExtentions;
    readonly id: string;
    readonly type: 'process';
    readonly name: string;
    readonly isExecutable: boolean;
    readonly behaviour: BpmnProcessBehaviour;
    readonly counters: BpmnCounter;
    readonly executionId: string;
    readonly status: string;
    readonly stopped: boolean;
    readonly execution: BpmnProcessExecution;
    readonly isRunning: boolean;
    readonly context: BpmnApiExecutionContext;
    readonly environment: BpmnEnvironment;
    readonly parent: BpmnProcess;
    readonly logger: BpmnLogger;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message?: M): BpmnProcessApi;
    getActivities(): BpmnActivity[];
    getActivityById(id: string): BpmnActivity;
    getSequenceFlows(): BpmnSequenceFlow[];
    getPostponed(): BpmnElement[];
    getStartActivities(): BpmnActivity[];
    getState(): BpmnProcessState;
    init(): void;
    recover<S = any>(state: S): BpmnProcess;
    resume(): BpmnProcessApi;
    run<M = any>(runContent: M): void;
    sendMessage<M extends BpmnMessage = BpmnApiMessage>(message: M): void;
    signal<M extends BpmnMessage = BpmnApiMessage>(message?: M): void;
    stop(): void;
}

export interface BpmnDefinitionApi extends BpmnApi<BpmnDefinition> {
    broker: BpmnDefinitionBroker;
    on: BpmnDefinitionBroker['on'];
    once: BpmnDefinitionBroker['once'];
    waitFor: BpmnDefinitionBroker['waitFor'];
    emit: BpmnDefinitionBroker['emit'];
    emitFatal: BpmnDefinitionBroker['emitFatal'];
    id: string;
    type: 'definition';
    name: string;
    logger: BpmnLogger;
    context: BpmnApiExecutionContext;
    readonly counters: BpmnCounter;
    readonly executionId: string;
    readonly status: string;
    readonly execution: BpmnDefinitionExecution;
    readonly isRunning: boolean;
    readonly environment: BpmnEnvironment;
    run<R>(callback?: BpmnCallback<R>): this;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message?: M): this;
    getState(): BpmnDefinitionState;
    getActivityById(id: string): BpmnActivity | null;
    getElementById(id: string): BpmnElement | null;
    getPostponed(): BpmnElement[];
    getProcesses(): BpmnProcess[];
    getExecutableProcesses(): BpmnProcess[];
    getProcessById(id: string): BpmnProcess;
    sendMessage<M extends BpmnMessage = BpmnApiMessage>(message: M): this;
    recover<S>(state?: S): this;
    resume<R>(callback?: BpmnCallback<R>): this;
    signal<M extends BpmnMessage = BpmnApiMessage>(message?: M): this;
    stop(): void;
}

export interface BpmnDefinitionExecution {
    id: string;
    type: 'definition';
    broker: BpmnDefinitionBroker;
    readonly environment: BpmnEnvironment;
    readonly executionId: string;
    readonly completed: boolean;
    readonly status: string;
    readonly stopped: boolean;
    readonly postponedCount: number;
    readonly isRunning: boolean;
    readonly processes: BpmnProcess[];
    createMessage<C extends BpmnContent, R = C>(content?: C): R;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message?: M): this;
    getState(): BpmnDefinitionState;
    getPostponed(): BpmnElement[];
    execute<M extends BpmnMessage = BpmnApiMessage>(message?: M): boolean;
    resume<R>(callback?: BpmnCallback<R>): this;
    recover<S>(state?: S): this;
    stop(): void;
}

export interface BpmnActivityApi extends BpmnApi<BpmnActivity> {
    readonly type: 'activity' | string;
    readonly broker: BpmnActivityBroker;
    on: BpmnActivityBroker['on'];
    once: BpmnActivityBroker['once'];
    waitFor: BpmnActivityBroker['waitFor'];
    readonly extensions: BpmnExtentions;

    readonly behaviour: BpmnActivityBehaviour;
    readonly isEnd: boolean;
    readonly isStart: boolean;
    readonly isSubProcess: boolean;
    readonly isThrowing: boolean;
    readonly isForCompensation: boolean;
    readonly triggeredByEvent: boolean;
    readonly parent: BpmnElement;
    attachedTo: BpmnActivity;
    readonly environment: BpmnEnvironment;
    readonly inbound: BpmnSequenceFlow[];
    readonly outbound: BpmnSequenceFlow[];
    readonly counters: BpmnCounter;
    readonly executionId: string;
    status:
        | 'enter'
        | 'entered'
        | 'discard'
        | 'start'
        | 'execute'
        | 'executing'
        | 'formatting'
        | 'executed'
        | 'end'
        | 'discarded';
    readonly stopped: boolean;
    readonly isRunning: boolean;
    Behaviour: BpmnActivityBehaviour;
    activate(): any;
    deactivate(): void;
    logger: BpmnLogger;
    discard(): void;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message?: M): BpmnActivityApi;
    getActivityById(id: string): BpmnActivity;
    getState(): BpmnActivityState;
    init(): void;
    recover<S = any>(state: S): BpmnActivityApi;
    resume(): BpmnActivityApi;
    run<M extends BpmnMessage = BpmnApiMessage>(runContent?: M): void;
    shake(): void;
    stop(): void;
    next<M extends BpmnMessage = BpmnApiMessage>(): M;
}

export interface BpmnProcessState {
    id: string;
    type: string;
    name: string;
    parent: BpmnProcessState;
    executionId: string;
    status: string;
    stopped: boolean;
    counters: BpmnCounter;
    broker: BpmnBrokerState;
    execution: BpmnExecutionProcessState;
}
export interface BpmnProcess extends BpmnProcessApi {
    new (processDefinition: any, context: BpmnApiExecutionContext);
}
export type BpmnProcessExecutionStatus = 'stopped' | 'idle' | 'error' | 'running';
export interface BpmnProcessExecution {
    readonly id: string;
    readonly type: string;
    readonly broker: BpmnExecutionBroker;
    readonly environment: BpmnEnvironment;
    readonly executionId: string;
    readonly completed: boolean;
    readonly status: BpmnProcessExecutionStatus;
    readonly stopped: boolean;
    readonly postponedCount: number;
    readonly isRunning: boolean;
    discard(): void;
    execute<M extends BpmnMessage = BpmnApiMessage>(executeMessage: M): boolean;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message?: M): BpmnProcessApi;
    getActivityById(id: string): BpmnActivity;
    getActivities(): BpmnActivity[];
    getPostponed(): BpmnElement[];
    getSequenceFlows(): BpmnSequenceFlow[];
    getState(): BpmnExecutionProcessState;
    recover(): BpmnProcessExecution;
    stop(): void;
}
export type BpmnExecutionProcessStatus = 'start' | 'init' | 'discard' | 'terminate' | 'executing';
export interface BpmnCounter extends Record<string, number> {}

export interface BpmnActivityState {
    id: string;
    type: string;
    counters: BpmnCounter;
}
export interface BpmnAssociationState {
    id: string;
    type: string;
    counters: BpmnCounter;
}
export interface BpmnFlowState {
    id: string;
    type: string;
    counters: BpmnCounter;
}
export interface BpmnMessageFlowState {
    id: string;
    type: string;
    counters: BpmnCounter;
}
export interface BpmnExecutionProcessState {
    executionId: string;
    stopped: boolean;
    completed: boolean;
    status: BpmnExecutionProcessStatus;
    children: BpmnActivityState[];
    flows: BpmnFlowState[];
    messageFlows: BpmnMessageFlowState[];
    associations: BpmnAssociationState[];
}

export interface BpmnDefinitionState {
    readonly executionId: string;
    readonly stopped: boolean;
    readonly completed: boolean;
    readonly status: string;
    readonly processes: BpmnProcessState[];
}

export interface BpmnEngineRuntimeState {
    readonly name: string;
    readonly state: BpmnEngineRuntimeStateType;
    readonly stopped: boolean;
    readonly engineVersion: boolean;
    readonly environment: BpmnEnvironment;
    readonly definitions: BpmnDefinitionState;
}
export type BpmnEngineRuntimeStateType = 'stopped' | 'idle' | 'error' | 'running';
export interface BpmnEngineRuntimeOptions {
    name?: string;
    variables?: BpmnVariables;

    Logger?: BpmnLogger;

    scripts?: Record<string, BpmnScript>;
    listener?: EventEmitter;
    services?: BpmnServices;

    elements?: any;

    typeResolver?: <R>(...elements: any) => R;
    moddleOptions?: any;

    extensions?: BpmnExtentions;
}

export interface BpmnEngineRuntime extends EventEmitter {
    readonly broker: BpmnBroker<this>;
    readonly name: string;

    // readonly on: BpmnBroker['on'];
    // readonly once: BpmnBroker['once'];
    // readonly off: BpmnBroker['off'];

    readonly environment: BpmnEnvironment;
    readonly execution: BpmnProcessExecution;
    readonly stopped: boolean;
    readonly state: BpmnEngineRuntimeStateType;
    execute<P extends BpmnEngineRuntimeOptions = BpmnEngineRuntimeOptions>(
        executeOptions?: P,
    ): Promise<BpmnEngineRuntimeApi>;
    logger: BpmnLogger;
    getDefinitionById(id: string): Promise<BpmnDefinition>;
    getDefinitions(executeOptions?: BpmnEngineRuntimeOptions): Promise<BpmnDefinition[]>;
    getState(): Promise<BpmnEngineRuntimeState>;
    recover<S, P>(savedState: S, recoverOptions: P): this;
    resume<P extends BpmnEngineRuntimeOptions = BpmnEngineRuntimeOptions>(
        executeOptions?: P,
    ): Promise<BpmnEngineRuntimeApi>;
    stop(): Promise<void>;
    waitFor<R = void>(eventName: string, onMessage?: OnMessageCallback): Promise<R>;
}
export interface BpmnEngineRuntimeApi {
    readonly name: string;
    readonly state: BpmnEngineRuntimeStateType;
    readonly stopped: boolean;
    readonly environment: BpmnEnvironment;
    readonly definitions: BpmnDefinition[];
    stop(): Promise<void>;
    getState(): Promise<BpmnEngineRuntimeState>;
    getPostponed(): Promise<BpmnElement[]>;
    waitFor<R = void>(eventName: string, onMessage?: OnMessageCallback): Promise<R>;
}

export type OnMessageCallback = (routingKey: string, message: string, owner: any) => void;
