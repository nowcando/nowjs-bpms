/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance, BpmnProcessActivity } from '../BpmnProcessInstance';

export const UserTaskExtension = (processInstance: BpmnProcessInstance) => (activity: any) => {
    if (!activity.behaviour) return;
    if (activity.type.toLowerCase() === 'bpmn:UserTask'.toLowerCase()) {
        activity.on('wait', async (api: BpmnProcessActivity) => {
            const bpms = processInstance.BpmnEngine.BpmsEngine;
            if (bpms) {
                const { fields, content, properties, ...variables } = api.environment.variables;
                const initiator = variables.initiator;
                const assignees: { userId: string; username: string }[] = [];
                const potentialOwner = api.content.potentialOwner;
                const performerUsers = api.content.humanPerformer && (await api.content.humanPerformer(api));
                if (Array.isArray(performerUsers)) {
                    for (const user of performerUsers) {
                        assignees.push(user);
                    }
                } else {
                    assignees.push(performerUsers || initiator);
                }
                for (const assignee of assignees) {
                    const t = await bpms.TaskService.create({
                        name: api.name,
                        activityId: api.id,
                        activityType: api.type,
                        processDefinitionId: processInstance.DefinitionId,
                        processDefinitionName: processInstance.DefinitionName,
                        processDefinitionVersion: processInstance.DefinitionVersion,
                        processInstanceName: processInstance.Name,
                        processInstanceId: processInstance.Id,
                        tenantId: bpms.Name,
                        priority: 'normal',
                        descriptions: '',
                        variables: variables,
                        assignee: assignee,
                    });
                }
            }
        });
    }
};
