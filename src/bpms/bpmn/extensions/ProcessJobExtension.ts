/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsRoute } from '../../router/RouterService';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';
import { BpmnActivity } from '../definitions/bpmn-elements';

export const ProcessJobExtension = (processInstance: BpmnProcessInstance | BpmnDefinitionInstance) => (
    activity: BpmnActivity,
) => {
    if (activity.type !== 'bpmn:Process') return;

    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        const bh = activity.behaviour;
        const j = {
            processDefinitionId: processInstance.DefinitionId,
            processDefinitionName: processInstance.DefinitionName,
            processDefinitionVersion: processInstance.DefinitionVersion,
            processId: processInstance?.Id,
            id: activity?.id,
            name: activity?.name,
            type: activity?.type,
        };
        bpms.JobService.create(j);
    }
    return;
};
