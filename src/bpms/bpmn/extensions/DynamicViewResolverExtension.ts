/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsDynamicView, BpmsDynamicViewModel } from '../../ui/UIService';

export const DynamicViewResolverExtension = (processInstance: BpmnProcessInstance) => activity => {
    if (!activity.behaviour.extensionElements || !activity.behaviour.extensionElements.values) return;

    const extendValues = activity.behaviour.extensionElements.values;
    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        const io = extendValues.forEach((extn, ix) => {
            if (extn.$type === 'camunda:DynamicView' || extn.$type === 'nowjs:DynamicView') {
                // result.input = extension.inputParameters;
                const view: BpmsDynamicViewModel = {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: activity?.parent?.id,
                    processName: activity?.parent?.name,
                    activityName: activity.name,
                    activityId: activity.id,
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
                bpms.UIService.create(view as any)
                    .then(xx => xx)
                    .catch(e => {});
            }
        });
    }
    return;
};
