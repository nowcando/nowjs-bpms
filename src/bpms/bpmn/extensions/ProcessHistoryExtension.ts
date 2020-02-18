/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmsRoute } from '../../router/RouterService';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';
import { BpmnActivity } from '../definitions/bpmn-elements';

function getMessage(message: BpmnActivity) {
    const { variables, output } = message.environment || {};
    const { fields, content, properties, ...v } = variables;
    const { fields: fields1, content: content1, properties: properties1, ...o } = output;
    const d = { variables: v, output: o };
    return d;
}
export const ProcessHistoryExtension = (processInstance: BpmnProcessInstance | BpmnDefinitionInstance) => (
    activity: BpmnActivity,
) => {
    if (!activity) return;

    const bpms = processInstance.BpmnEngine.BpmsEngine;
    if (bpms) {
        activity.on('activity.enter', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100220,
                message: 'The activity has been entered',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('activity.leave', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100222,
                message: 'The activity has been leaved',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('activity.start', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100224,
                message: 'The activity has been started',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('activity.end', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100226,
                message: 'The activity has been ended',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('activity.wait', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100228,
                message: 'The activity has been waited',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('activity.throw', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100230,
                message: 'The activity has been throws',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('activity.error', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100232,
                message: 'The activity throws error',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('flow.take', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100236,
                message: 'The flow has been taken',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('flow.discard', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100238,
                message: 'The flow has been discarded',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
        activity.on('flow.loop', message => {
            const d = getMessage(message);
            bpms.HistoryService.create({
                type: 'info',
                source: 'ProcessHistoryExtension',
                eventId: 100240,
                message: 'The flow has been looped',
                data: {
                    processDefinitionId: processInstance.DefinitionId,
                    processDefinitionName: processInstance.DefinitionName,
                    processDefinitionVersion: processInstance.DefinitionVersion,
                    processId: processInstance?.Id,
                    id: activity?.id,
                    name: activity?.name,
                    type: activity?.type,
                    d,
                },
            });
        });
    }
    return;
};
