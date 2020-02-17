/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';

export const SaveToEnvironmentOutputExtension = (processInstance: BpmnProcessInstance | BpmnDefinitionInstance) => (
    activity,
    { environment },
) => {
    activity.on('end', api => {
        if (api.content.output) environment.output[api.id] = api.content.output;
    });
};
