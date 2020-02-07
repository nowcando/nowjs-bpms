/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance, BpmnProcessActivity } from '../BpmnProcessInstance';

export const UserTaskExtension = (processInstance: BpmnProcessInstance) => (activity: any) => {
    if (!activity.behaviour) return;
    if (
        activity.type.toLowerCase() !== 'bpmn:UserTask'.toLowerCase() ||
        activity.type.toLowerCase() !== 'bpmn:StartEvent'.toLowerCase()
    ) {
        activity.on('wait', async (api: BpmnProcessActivity) => {
            const bpms = processInstance.BpmnEngine.BpmsEngine;
            if (bpms) {
                const t = await bpms.TaskService.create({
                    name: api.name,
                    activityId: api.id,
                    processDefinitionId: processInstance.DefinitionId,
                    processInstanceName: processInstance.Name,
                    processInstanceId: processInstance.Id,
                    processExecutionId: api.environment.variables.content.executionId,
                    tenantId: bpms.Name,
                });
            }
        });
    }
};
