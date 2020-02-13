/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';

export const SaveToResultVariableExtension = (processInstance: BpmnProcessInstance) => activity => {
    if (!activity.behaviour.resultVariable) return;
    activity.on('end', ({ environment, content }) => {
        environment.output[activity.behaviour.resultVariable] = content.output[0];
    });
};
