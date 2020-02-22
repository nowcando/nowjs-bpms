/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsRoute } from '../../router/RouterService';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';

export const ProcessExtension = (processInstance: BpmnProcessInstance | BpmnDefinitionInstance) => activity => {
    if (activity.type !== 'bpmn:Process') return;

    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        const x = activity.behaviour;
        const route: BpmsRoute = {
            definitionId: processInstance.DefinitionId,
            definitionName: processInstance.DefinitionName,
            definitionVersion: processInstance.DefinitionVersion,
            processId: activity?.id,
            processName: activity?.name,
            name: activity?.name,
            route: x.route,
            title: x.title,
            type: x.type || 'dynamic',
            target: x.routeTarget,
            enabled: x.routeEnabled,
            category: x.category,
            tags: x.tags,
            displayOrder: x.routeOrder,
            icon: x.icon,
            class: x.routeClass,
            authorization: x.authorization,
            author: x.author,
            // canStartByUser: x.isStartableInTasklist,
        };
        bpms.RouterService.create(route)
            .then(xx => xx)
            .catch(e => {});
    }
    return;
};
