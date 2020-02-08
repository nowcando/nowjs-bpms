/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';

export const SaveToEnvironmentOutputExtension = (processInstance: BpmnProcessInstance) => (
    activity,
    { environment },
) => {
    activity.on('end', api => {
        if (api.content.output) environment.output[api.id] = api.content.output;
    });
};
