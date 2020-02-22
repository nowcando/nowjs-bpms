/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsUI, BpmsDynamicViewModel } from '../../ui/UIService';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';
import { getBpmnDocumentation } from '../../utils/BpmnUtils';

export const DynamicViewResolverExtension = (
    processInstance: BpmnProcessInstance | BpmnDefinitionInstance,
) => activity => {
    if (!activity.behaviour.extensionElements || !activity.behaviour.extensionElements.values) return;

    const extendValues = activity.behaviour.extensionElements.values;
    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        const actions = [];
        const doc = getBpmnDocumentation(activity);
        const io = extendValues.forEach((extn, ix) => {
            if (extn.$type === 'camunda:DynamicView' || extn.$type === 'nowjs:DynamicView') {
                // result.input = extension.inputParameters;
                const view: BpmsUI = {
                    definitionId: processInstance.DefinitionId,
                    definitionName: processInstance.DefinitionName,
                    definitionVersion: processInstance.DefinitionVersion,
                    processId: activity?.parent?.id,
                    processName: activity?.parent?.name,
                    activityName: activity.name,
                    activityId: activity.id,
                    activityType: activity.type,
                    name: extn.name,
                    title: extn.title,
                    descriptions: doc,
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
                    script: extn.script && {
                        resource: extn.script.resource,
                        format: extn.script.scriptFormat,
                        content: extn.script.value,
                    },
                    template: extn.template && {
                        resource: extn.template.resource,
                        format: extn.template.templateFormat,
                        content: extn.template.value,
                    },
                    style: extn.style && {
                        resource: extn.style.resource,
                        format: extn.style.styleFormat,
                        content: extn.style.value,
                    },
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
