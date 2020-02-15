/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { EventEmitter } from 'events';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface BpmnLogger {
    debug(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
}
export interface BpmnMessage {
    fields: BpmnApiFields;
    content: BpmnApiContent;
    properties: BpmnApiProperties;
}

export interface BpmnBehaviour extends Record<string, any> {
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
export interface BpmnProcessExecutionDefinition extends EventEmitter {
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
    environment: BpmnEnvironmentApi;
    status: string;
    stopped: boolean;
    type: string;
    signal<M extends BpmnMessage = BpmnApiMessage>(message?: M): void;
    broker: BpmnDefinitionBroker;
    id: string;
    isRunning: boolean;
    name: string;
    logger: BpmnLogger;
    waitFor<R>(name: string, fn: Function): Promise<R>;
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
    state: 'idle' | 'running';
    stopped: boolean;
    engineVersion: string;
    environment: BpmnEnvironmentApi;
    definitions: BpmnProcessExecutionDefinitionState[];

    entered: boolean;
}

export interface BpmnElement {
    id: string;
    type: BpmnElementType;
    name: string;
}
export interface BpmnActivity extends BpmnElement, BpmnActivityApi {}
export interface BpmnFlow extends BpmnElement {}
export interface BpmnDefinition {}

export interface BpmnBroker<W = any> {
    new (owner: W);
    owner: W;
    dismiss(onMessage: any): void;
    subscribeTmp(exchangeName: string, pattern: string, onMessage?: any, options?: any): any;
    subscribeOnce(exchangeName: string, pattern: string, onMessage?: any, options?: any): any;
    unsubscribe(queueName: string, onMessage: any): void;
    assertExchange(exchangeName: string, type?: string, options?: any): void;
    deleteExchange(exchangeName: string, ifUnused?: boolean): void;
    bindExchange(source: string, destination: string, pattern?: any, ...args: any[]): void;
    unbindExchange(source: string, destination: string, pattern?: any): any;

    publish(exchangeName: string, routingKey: string, content?: any, options?: any): void;
    close(): void;

    assertQueue(
        queueName: string,
        options?: { durable?: boolean; autoDelete?: boolean; deadLetterExchange?: string },
    ): void;
    bindQueue(queueName: string, exchangeName: string, pattern: string, options?: any): void;
    unbindQueue(queueName: string, exchangeName: string, pattern: string): void;
    consume(queueName: string, onMessage: any, options?: any): void;
    cancel(consumerTag: string): void;
    createQueue(): any;
    deleteQueue(queueName: string, options?: { ifUnused: boolean; ifEmpty?: boolean }): void;
    getExchange(exchangeName: string): any;
    getQueue(queueName: string): any;
    getState(): any;
    recover(state: any): any;
    purgeQueue(queueName: string): void;
    sendToQueue(queueName: string, content?: any, options?: any): void;
    stop(): void;
    reset(): void;
    get(queueName: string, options: any): any;
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
    off(eventName: string, handler: Function): void;
    createShovel(name: string, source: string, destination: string, options: any): any;
    getShovel(name: string): any;
    closeShovel(name: string): void;
}
export interface BpmnActivityBroker extends BpmnExecutionBroker<BpmnActivity> {}
export interface BpmnProcessBroker extends BpmnExecutionBroker<BpmnProcess> {}
export interface BpmnMessageFlowBroker extends BpmnEventBroker<BpmnFlow> {}
export interface BpmnDefinitionBroker extends BpmnEventBroker<BpmnDefinition> {}
export interface BpmnExecutionBroker<W = any> extends BpmnEventBroker<W> {}
export interface BpmnEventBroker<W = any> extends BpmnBroker<W> {
    new (brokerOwner: W, options?: any, onBrokerReturn?: (message?: any) => void);
    broker: BpmnBroker<W>;
    eventPrefix: string;

    on<M = W, R = any>(
        eventName: string,
        callback: (message: M) => void,
        eventOptions?: { once?: boolean } & Record<string, any>,
    ): R;
    once<M = W, R = any>(eventName: string, callback: (message: M) => void, eventOptions?: Record<string, any>): R;
    waitFor<R>(eventName: string, onMessage?: (...args: any[]) => void): Promise<R>;
    emit<C = Record<string, any>, P = BpmnApiContent>(eventName: string, content?: C, props?: P): void;
    emitFatal<E = Error | string, C = BpmnApiContent>(error: E, content?: C): void;
}
export interface BpmnBrokerState {}

export interface BpmnApiState {
    settings: BpmnApiSettings;
    variables: BpmnApiVariables;
    output: BpmnApiOutput;
}

// export function cloneContent(content, extend) {}
// export function cloneMessage(message, overrideContent) {}
// export function cloneParent(parent) {}
// export function unshiftParent(parent, adoptingParent) {}
// export function pushParent(parent, ancestor) {}

export interface BpmnDataObject extends BpmnElement {}
export interface BpmnAssociation extends BpmnElement {}
export interface BpmnFlow extends BpmnElement {}
export interface BpmnSequenceFlow extends BpmnFlow {}
export interface BpmnMessageFlow extends BpmnFlow {}

export interface BpmnExtention {
    activate<M extends BpmnMessage = BpmnApiMessage>(message?: M): void;
    deactivate<M extends BpmnMessage = BpmnApiMessage>(message?: M): void;
}
export interface BpmnApiExecutionContext {
    id: string;
    name: string;
    type: string;
    sid: string;
    definitionContext: any;
    environment: BpmnEnvironmentApi;
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
    loadExtensions(activity: BpmnActivity): BpmnApiExtentions;
}
export interface BpmnExpressions {
    resolveExpression: BpmnApiResolveExpression;
    isExpression(text: string): boolean;
    hasExpression(text: string): boolean;
}
export type BpmnCallback<R, Z = void> = (err: Error, result: R) => Z;
export interface BpmnScript {
    execute<R, Z = void>(executionContext: BpmnApiExecutionContext, callback?: BpmnCallback<R>): Z;
}
export interface BpmnApiScript {
    getScript(scriptType: string, activity: BpmnActivityApi): BpmnScript;
    register(activity: BpmnActivityApi): void;
}
export type BpmnApiService<M = any, C = any, R = void> = (executionMessage: M, callback: BpmnCallback<C>) => R;
export interface BpmnApiSettings {}
export interface BpmnApiExpression {}
export type BpmnApiResolveExpression = <E = string>(expression: string, apiMessage?: BpmnApiMessage, owner?: any) => E;
export interface BpmnApiVariables<E = any> extends Record<string, E> {}
export interface BpmnApiOutput<E = any> extends Record<string, E> {}
export interface BpmnApiMessage extends BpmnMessage {}
export type BpmnApiExtention<R = void> = (elment: BpmnElement, context: BpmnProcess) => R;
export interface BpmnApiExtentions extends Record<string, BpmnApiExtention> {}
export interface BpmnEnvironmentApiOptions extends Record<string, any> {}
export interface BpmnEnvironmentApi {
    options: BpmnEnvironmentApiOptions;
    expressions: BpmnApiExpression[];
    extensions: BpmnApiExtentions[];
    output: BpmnApiOutput;
    scripts: BpmnApiScript[];
    services: BpmnApiService[];
    settings: BpmnApiSettings;
    variables: BpmnApiVariables;
    addService(name: string, fn: BpmnApiService): void;
    assignVariables(newVars: BpmnApiVariables): void;
    clone(): BpmnEnvironmentApi;
    getScript(...args: any[]): BpmnApiScript;
    getServiceByName(serviceName: string): BpmnApiService;
    getState(): BpmnApiState;
    registerScript(...args: any[]): void;
    resolveExpression: BpmnApiResolveExpression;
    recover(state: BpmnApiState): BpmnEnvironmentApi;
    Logger: BpmnLogger;
}

export interface BpmnApiFields extends Record<string, any> {}

export interface BpmnApiContent extends Record<string, any> {}
export interface BpmnApiProperties extends Record<string, any> {}

export type BpmnElementType = 'activity' | 'process' | 'flow' | 'defnition';
export interface BpmnApi<T> {
    id: string;
    type: BpmnElementType;
    name: string;
    executionId: string;
    environment: BpmnEnvironmentApi;
    fields: BpmnApiFields;
    content: BpmnApiContent;
    messageProperties: BpmnApiProperties;
    owner: any;
    cancel(): void;
    discard(): void;
    signal<M extends BpmnMessage = BpmnApiMessage, P = any>(message: M, options: P): void;
    stop(): void;
    resolveExpression(expression: string): string;
    sendApiMessage(action: string, content: BpmnApiContent, options?: any): void;
    createMessage<C extends BpmnApiContent, R = C>(content?: C): R;
    getPostponed(...args: any[]): BpmnElement[];
}

export interface BpmnFlowApi extends BpmnApi<BpmnFlow> {}

export interface BpmnProcessApi {
    broker: BpmnProcessBroker;
    on: BpmnProcessBroker['on'];
    once: BpmnProcessBroker['once'];
    waitFor: BpmnProcessBroker['waitFor'];
    extensions: BpmnApiExtentions;
    id: string;
    type: BpmnElementType;
    name: string;
    isExecutable: boolean;
    behaviour: BpmnProcessBehaviour;
    counters: BpmnCounter;
    executionId: string;
    status: string;
    stopped: boolean;
    execution: BpmnProcessExecution;
    isRunning: boolean;
    context: any;
    environment: BpmnEnvironmentApi;
    parent: BpmnProcess;
    logger: BpmnLogger;
    getApi(): BpmnApi<BpmnProcess>;
    getActivities(): BpmnActivity[];
    getActivityById(id: string): BpmnActivity;
    getSequenceFlows(): BpmnSequenceFlow[];
    getPostponed(): BpmnElement[];
    getStartActivities(): BpmnActivity[];
    getState(): BpmnProcessState;
    init(): void;
    recover<S = any>(state: S): BpmnProcessApi;
    resume(): BpmnProcessApi;
    run<M = any>(runContent: M): void;
    sendMessage<M extends BpmnMessage = BpmnApiMessage>(message: M): void;
    signal<M extends BpmnMessage = BpmnApiMessage>(message?: M): void;
    stop(): void;
}

export interface BpmnDefinitionApi extends BpmnApi<BpmnDefinition> {}

export interface BpmnActivityApi extends BpmnApi<BpmnActivity> {
    broker: BpmnActivityBroker;
    on: BpmnActivityBroker['on'];
    once: BpmnActivityBroker['once'];
    waitFor: BpmnActivityBroker['waitFor'];
    extensions: BpmnApiExtentions;

    behaviour: BpmnActivityBehaviour;
    isEnd: boolean;
    isStart: boolean;
    isSubProcess: boolean;
    isThrowing: boolean;
    isForCompensation: boolean;
    triggeredByEvent: boolean;
    parent: BpmnElement;
    attachedTo: BpmnActivity;
    environment: BpmnEnvironmentApi;
    inbound: BpmnSequenceFlow[];
    outbound: BpmnSequenceFlow[];
    counters: BpmnCounter;
    executionId: string;
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
    stopped: boolean;
    isRunning: boolean;
    Behaviour: BpmnActivityBehaviour;
    activate(): any;
    deactivate(): void;
    logger: BpmnLogger;
    discard(): void;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message: M): BpmnActivityApi;
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
export interface BpmnProcess {
    new (processDefinition: any, context: BpmnApiExecutionContext);
    id: string;
    type: string;
    name: string;
    isExecutable: boolean;
    behaviour: any;
    counters: BpmnCounter;
    executionId: string;
    status: string;
    stopped: boolean;
    execution: BpmnProcessExecution;
    isRunning: boolean;
    context: BpmnApiExecutionContext;
    environment: BpmnEnvironmentApi;
    parent: BpmnProcess;
    logger: BpmnLogger;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message: M): BpmnProcessApi;
    getActivities(): BpmnActivity[];
    getActivityById(id: string): BpmnActivity;
    getSequenceFlows(): BpmnSequenceFlow[];
    getPostponed(): BpmnElement[];
    getStartActivities(): BpmnActivity[];
    getState(): BpmnProcessState;
    init(): void;
    recover<S = any>(state: S): BpmnProcessApi;
    resume(): BpmnProcessApi;
    run<M extends BpmnMessage = BpmnApiMessage>(runContent?: M): void;
    sendMessage<M extends BpmnMessage = BpmnApiMessage>(message: M): void;
    signal<M = any>(message?: M): void;
    stop(): void;
}
export type BpmnProcessExecutionStatus = 'running' | 'idle';
export interface BpmnProcessExecution {
    id: string;
    type: string;
    broker: BpmnExecutionBroker;
    environment: BpmnEnvironmentApi;
    executionId: string;
    completed: boolean;
    status: BpmnProcessExecutionStatus;
    stopped: boolean;
    postponedCount: number;
    isRunning: boolean;
    discard(): void;
    execute<M extends BpmnMessage = BpmnApiMessage>(executeMessage: M): boolean;
    getApi<M extends BpmnMessage = BpmnApiMessage>(message: M): BpmnProcessApi;
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
