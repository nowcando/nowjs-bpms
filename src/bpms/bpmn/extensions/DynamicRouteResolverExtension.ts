/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsRoute } from '../../router/RouterService';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';

export const DynamicRouteResolverExtension = (
    processInstance: BpmnProcessInstance | BpmnDefinitionInstance,
) => activity => {
    if (!activity.behaviour.extensionElements || !activity.behaviour.extensionElements.values) return;

    const extendValues = activity.behaviour.extensionElements.values;
    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        const io = extendValues.forEach((extn, ix) => {
            if (extn.$type === 'camunda:DynamicRoute' || extn.$type === 'nowjs:DynamicRoute') {
                if (extn.route) {
                    const route: BpmsRoute = {
                        definitionId: processInstance.DefinitionId,
                        definitionName: processInstance.DefinitionName,
                        definitionVersion: processInstance.DefinitionVersion,
                        processId: activity?.parent?.id,
                        processName: activity?.parent?.name,
                        name: extn.name,
                        route: extn.route,
                        variables: extn.variables || {},
                        title: extn.title,
                        type: extn.type || 'static',
                        target: extn.target,
                        enabled: extn.enabled,
                        category: extn.category,
                        tags: extn.tags,
                        displayOrder: extn.displayOrder,
                        icon: extn.icon,
                        class: extn.class,
                        authorization: extn.authorization,
                        author: extn.author,
                    };
                    bpms.RouterService.create(route)
                        .then(xx => xx)
                        .catch(e => {});
                }
            }
        });
    }
    return;
};
