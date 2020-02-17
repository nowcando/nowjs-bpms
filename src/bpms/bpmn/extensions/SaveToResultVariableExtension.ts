/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';

export const SaveToResultVariableExtension = (
    processInstance: BpmnProcessInstance | BpmnDefinitionInstance,
) => activity => {
    if (!activity.behaviour.resultVariable) return;
    activity.on('end', ({ environment, content }) => {
        environment.output[activity.behaviour.resultVariable] = content.output[0];
    });
};
