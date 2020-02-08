/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';

export const InputOutputExtension = (processInstance: BpmnProcessInstance) => activity => {
    if (!activity.behaviour.extensionElements || !activity.behaviour.extensionElements.values) return;

    const extendValues = activity.behaviour.extensionElements.values;
    const io = extendValues.reduce((result, extension) => {
        if (extension.$type === 'camunda:InputOutput' || extension.$type === 'nowjs:InputOutput') {
            result.input = extension.inputParameters;
        }
        return result;
    }, {});

    activity.on('enter', elementApi => {
        if (!io || !io.input) return;
        activity.broker.publish('format', 'run.io', {
            io: {
                input: io.input.map(({ name, value }) => ({
                    name,
                    value: elementApi.resolveExpression(value),
                })),
            },
        });
    });
};
