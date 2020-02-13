/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';

export const FormDataResolverExtension = (processInstance: BpmnProcessInstance) => activity => {
    if (!activity.behaviour.extensionElements) return;
    let form;
    for (const extn of activity.behaviour.extensionElements.values) {
        if (extn.$type === 'camunda:FormData' || extn.$type === 'nowjs:FormData') {
            form = {
                fields: extn.fields.map(f => ({ ...f })),
            };
        }
    }

    activity.on('enter', () => {
        activity.broker.publish('format', 'run.form', { form });
    });
};
