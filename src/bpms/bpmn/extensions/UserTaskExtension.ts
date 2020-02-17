/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmnActivity } from '../definitions/bpmn-elements';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';

export const UserTaskExtension = (processInstance: BpmnProcessInstance | BpmnDefinitionInstance) => (
    activity: BpmnActivity,
) => {
    if (!activity.behaviour) return;
    if (activity.type.toLowerCase() === 'bpmn:UserTask'.toLowerCase()) {
        activity.on('wait', async api => {
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
                        processInstanceName: (processInstance as any)?.Name,
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
