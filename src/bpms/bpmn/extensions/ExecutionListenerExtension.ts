/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';

export const ExecutionListenerExtension = (processInstance: BpmnProcessInstance) => (activity: any) => {
    if (!activity.behaviour.extensionElements) return;

    const { broker, environment } = activity;
    const executionListeners: any[] = [];

    for (const extension of activity.behaviour.extensionElements.values) {
        switch (extension.$type) {
            case 'camunda:ExecutionListener': {
                executionListeners.push(ExecutionListener(extension));
                break;
            }
        }
    }

    return {
        extensions: executionListeners,
        activate(...args) {
            executionListeners.forEach(e => e.activate(...args));
        },
        deactivate() {
            executionListeners.forEach(e => e.deactivate());
        },
    };

    function ExecutionListener(extension) {
        return {
            activate() {
                const script = environment.scripts.getScript(extension.script.scriptFormat, {
                    id: extension.script.resource,
                });
                broker.subscribeTmp(
                    'event',
                    `activity.${extension.event}`,
                    (routingKey, message) => {
                        script.execute(message);
                    },
                    { noAck: true, consumerTag: '_executionListener-extension' },
                );
            },
            deactivate() {
                broker.cancel('_executionListener-extension');
            },
        };
    }
};
