/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsRoute } from '../../router/RouterService';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';
import { BpmnActivity } from '../definitions/bpmn-elements';
import { getBpmnDocumentation } from '../../utils/BpmnUtils';
import { BpmsJob } from '../../job/JobService';

export const ProcessJobExtension = (processInstance: BpmnProcessInstance | BpmnDefinitionInstance) => (
    activity: BpmnActivity,
) => {
    if (activity.type !== 'bpmn:Process') return;

    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        const bh = activity.behaviour;
        if (bh.job) {
            const doc = getBpmnDocumentation(activity);
            const j: BpmsJob = {
                definitionId: processInstance.DefinitionId,
                definitionName: processInstance.DefinitionName,
                definitionVersion: processInstance.DefinitionVersion,
                processInstanceId: processInstance?.Id,
                name: activity?.name,
                priority: bh.jobPriority || 0,
                descriptions: doc,
            };
            bpms.JobService.create(j);
        }
    }
    return;
};
