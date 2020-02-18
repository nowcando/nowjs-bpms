/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmnActivity } from '../definitions/bpmn-elements';

export const NowJsExtension = (processInstance: BpmnProcessInstance) => (activity: BpmnActivity, definition: any) => {
    if (activity.type.toLowerCase() === 'bpmn:Process'.toLowerCase()) {
        if (activity.behaviour && activity.behaviour.extensionElements && activity.behaviour.extensionElements.values) {
            for (const extn of activity.behaviour.extensionElements.values) {
                // process listener
                if (
                    extn.$type.toLowerCase() === 'camunda:executionListener'.toLowerCase() ||
                    extn.$type.toLowerCase() === 'nowjs:executionListener'.toLowerCase()
                ) {
                    if (extn.script && extn.script && extn.script.scriptFormat) {
                        if (extn.script.format === 'javascript') {
                            const lscript = extn && extn.script && extn.script.value;
                            if (lscript) {
                                try {
                                    const func = new Function('return ' + lscript)();
                                    activity.on(extn.event, func);
                                } catch (error) {
                                    activity.logger.error(`error in parsing listener function.`);
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        if (!activity.behaviour.extensionElements) {
            return;
        }
        let form;
        const views: any = {};
        // activity listener
        for (const extn of activity.behaviour.extensionElements.values) {
            if (
                extn.$type.toLowerCase() === 'camunda:executionListener'.toLowerCase() ||
                extn.$type.toLowerCase() === 'nowjs:executionListener'.toLowerCase() ||
                extn.$type.toLowerCase() === 'camunda:taskListener'.toLowerCase() ||
                extn.$type.toLowerCase() === 'nowjs:taskListener'.toLowerCase()
            ) {
                const lscript = extn && extn.script && extn.script.value;
                if (lscript) {
                    try {
                        const func = new Function('return ' + lscript)();
                        activity.on(extn.event, func);
                    } catch (error) {
                        activity.logger.error(`error in parsing listener function of ${activity.id}.`);
                    }
                }
            }

            if (
                extn.$type.toLowerCase() === 'camunda:DynamicView'.toLowerCase() ||
                extn.$type.toLowerCase() === 'nowjs:DynamicView'.toLowerCase()
            ) {
                const view = {
                    name: extn && extn.name,
                    title: extn && extn.title,
                    type: extn && extn.type,
                    target: extn && extn.target,
                    renderEngine: extn && extn.renderEngine,
                    renderEngineVersion: extn && extn.renderEngineVersion,
                    default: extn && extn.default,
                    enabled: extn && extn.enabled,
                    category: extn && extn.category,
                    tags: extn && extn.tags,
                    displayOrder: extn && extn.displayOrder,
                    icon: extn && extn.icon,
                    class: extn && extn.class,
                    script: extn && extn.script,
                    template: extn && extn.template,
                    style: extn && extn.style,
                    authorization: extn && extn.authorization,
                    author: extn && extn.author,
                };
                const viewType = 'DynamicView';
                const name = extn.name || 'default';
                const data = extn.data;
                views[name] = { name, view, viewType, data };
            }

            if (
                extn.$type.toLowerCase() === 'camunda:FormData'.toLowerCase() ||
                extn.$type.toLowerCase() === 'nowjs:FormData'.toLowerCase()
            ) {
                form = {
                    fields: extn && extn.fields && extn.fields.map(f => ({ ...f })),
                };
            }
        }

        activity.on('enter', () => {
            if (form) {
                activity.broker.publish('format', 'run.form', { form });
            }
        });

        if (
            activity.type.toLowerCase() !== 'bpmn:UserTask'.toLowerCase() ||
            activity.type.toLowerCase() !== 'bpmn:StartEvent'.toLowerCase()
        ) {
            activity.on('wait', async (api: BpmnActivity) => {
                const bpms = processInstance.BpmnEngine.BpmsEngine;
                if (bpms) {
                    const t = await bpms.TaskService.create({
                        name: api.name,
                        activityId: api.id,
                        definitionId: processInstance.DefinitionId,
                        processInstanceName: processInstance.Name,
                        processInstanceId: processInstance.Id,
                        processExecutionId: api.environment.variables.content.executionId,
                        tenantId: bpms.Name,
                    });
                }
            });
        }
    }
};
