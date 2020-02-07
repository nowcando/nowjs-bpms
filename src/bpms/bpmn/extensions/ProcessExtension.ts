/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsRoute } from '../../router/RouterService';

export const ProcessExtension = (processInstance: BpmnProcessInstance) => activity => {
    if (activity.type !== 'bpmn:Process') return;

    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        const route: BpmsRoute = {
            processDefinitionId: processInstance.DefinitionId,
            processDefinitionName: processInstance.DefinitionName,
            processDefinitionVersion: processInstance.DefinitionVersion,
            processId: activity?.id,
            processName: activity?.name,
            name: activity?.name,
            route: activity?.route,
            title: activity?.title,
            type: activity?.type || 'dynamic',
            target: activity?.routeTarget,
            enabled: activity?.routeEnabled,
            category: activity?.category,
            tags: activity?.tags,
            displayOrder: activity?.routeOrder,
            icon: activity?.icon,
            class: activity?.routeClass,
            authorization: activity?.authorization,
            author: activity?.author,
            canStartByUser: activity?.isStartableInTasklist,
        };
        bpms.RouterService.create(route)
            .then(xx => xx)
            .catch(e => {});
    }
    return;
};
