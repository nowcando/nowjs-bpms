/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as elements from 'bpmn-elements';

import BpmnModdle from 'bpmn-moddle';

import { default as serialize, TypeResolver } from 'moddle-context-serializer';
import { BpmnApiExecutionContext, BpmnDefinition, BpmnServices, BpmnExtentions } from './definitions/bpmn-elements';
import { BpmnEngine } from './BpmnEngine';
import { uuidv1 } from 'nowjs-core/lib/utils/UuidUtils';
import { BpmnProcessInstance } from '.';

const { Context, Definition } = elements;
const typeResolver = TypeResolver(elements);

export class BpmnDefinitionInstance {
    private definition!: BpmnDefinition;
    private bpmnEngine: BpmnEngine;
    private id = uuidv1();
    private definitionId?: string;
    private definitionName?: string;
    private definitionVersion?: number;
    private options: any = {};
    constructor(bpmnEngine: BpmnEngine, options: any) {
        this.id = options.id;
        this.definitionId = options.definitionId;
        this.definitionName = options.definitionName;
        this.definitionVersion = options.definitionVersion;
        const internalElements = {};
        const internalServices: BpmnServices = BpmnProcessInstance.getDefaultBpmnServices(bpmnEngine);
        const internalExtentions: BpmnExtentions = BpmnProcessInstance.getDefaultExtensions(this);
        const internalModdles = BpmnProcessInstance.getDefaultModdles(bpmnEngine);
        options.moddleOptions = {
            ...internalModdles,
            ...options.moddleOptions,
        };
        options.services = { ...internalServices, ...options.services };
        options.elements = { ...internalElements, ...options.elements };
        options.extensions = { ...internalExtentions, ...options.extensions };
        this.options = options;
        this.bpmnEngine = bpmnEngine;
    }

    public get BpmnEngine() {
        return this.bpmnEngine;
    }

    public get Id() {
        return this.id;
    }

    public get DefinitionId() {
        return this.definitionId;
    }
    public get DefinitionName() {
        return this.definitionName;
    }
    public get DefinitionVersion() {
        return this.definitionVersion;
    }
    public async run(): Promise<BpmnDefinition> {
        if (this.definition) return this.definition;
        const moddleContext = await this.getModdleContext(this.options.source);
        const context: BpmnApiExecutionContext = Context(serialize(moddleContext, typeResolver));
        this.definition = Definition(context, this.options);
        return this.definition.run();
    }
    private async getModdleContext(sourceXml: string): Promise<any> {
        const bpmnModdle = new BpmnModdle();

        return new Promise((resolve, reject) => {
            bpmnModdle.fromXML(sourceXml.trim(), (err, definitions, moddleCtx) => {
                if (err) return reject(err);
                resolve(moddleCtx);
            });
        });
    }
}
