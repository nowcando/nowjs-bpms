/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsDynamicView, BpmsDynamicViewModel } from '../../ui/UIService';

export const DynamicViewResolverExtension = (processInstance: BpmnProcessInstance) => activity => {
    if (!activity.behaviour.extensionElements || !activity.behaviour.extensionElements.values) return;

    const extendValues = activity.behaviour.extensionElements.values;
    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        const actions = [];
        const io = extendValues.forEach((extn, ix) => {
            if (extn.$type === 'camunda:DynamicView' || extn.$type === 'nowjs:DynamicView') {
                // result.input = extension.inputParameters;
                const view: BpmsDynamicView = {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: activity?.parent?.id,
                    processName: activity?.parent?.name,
                    activityName: activity.name,
                    activityId: activity.id,
                    activityType: activity.type,
                    name: extn.name,
                    title: extn.title,
                    type: extn.type,
                    target: extn.target,
                    renderEngine: extn.renderEngine,
                    renderEngineVersion: extn.renderEngineVersion,
                    default: extn.default,
                    enabled: extn.enabled,
                    category: extn.category,
                    tags: extn.tags,
                    displayOrder: extn.displayOrder,
                    icon: extn.icon,
                    class: extn.class,
                    script: extn.script,
                    template: extn.template,
                    style: extn.style,
                    authorization: extn.authorization,
                    author: extn.author,
                    actions: actions,
                };
                bpms.UIService.create(view)
                    .then(xx => xx)
                    .catch(e => {});
            }
        });
    }
    return;
};
