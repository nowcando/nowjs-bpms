/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import ExecutionScope from 'bpmn-elements/dist/src/activity/ExecutionScope';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';
function ServiceExpression(activity: any) {
    const { type: atype, behaviour, environment } = activity;
    const expression = behaviour.expression || activity.behaviour.implementation;
    const type = `${atype}:${behaviour.implementation ? 'implementation' : 'expression'}`;
    return {
        type,
        expression,
        execute,
    };
    function execute(executionMessage: any, callback: any) {
        const serviceFn = environment.resolveExpression(expression, executionMessage);
        if (typeof serviceFn !== 'function') {
            callback(
                new Error(
                    `${behaviour.implementation ? 'Implementation' : 'Expression'}  did not resolve to a function`,
                ),
            );
        }
        if (serviceFn) {
            serviceFn.call(activity, ExecutionScope(activity, executionMessage), callback);
        } else {
            callback(new Error(`Service not found`));
        }
    }
}

export const ServiceTaskExtension = (processInstance: BpmnProcessInstance | BpmnDefinitionInstance) => (
    activity: any,
) => {
    if (activity.type.toLowerCase() !== 'bpmn:ServiceTask'.toLowerCase()) {
        return;
    }
    if (activity.behaviour.expression || activity.behaviour.implementation) {
        activity.behaviour.Service = ServiceExpression;
    }
    if (activity.behaviour.resultVariable) {
        activity.on('end', api => {
            activity.environment.output[activity.behaviour.resultVariable] = api.content.output;
        });
    }
};
