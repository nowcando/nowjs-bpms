/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import ExecutionScope from 'bpmn-elements/dist/src/activity/ExecutionScope';
import { BpmnDefinitionInstance } from '../BpmnDefinitionInstance';
function BusinessRuleTaskService(activity: any) {
    const { type: atype, behaviour, environment } = activity;
    const expression = behaviour.implementation || behaviour.expression;
    const type = `${atype}:${behaviour.implementation ? 'implementation' : 'expression'}`;
    return {
        type,
        expression,
        execute,
    };
    function execute(executionMessage: any, callback: any) {
        // console.log(`BusinessRuleTaskService executed`);
        const serviceFn = environment.resolveExpression(expression, executionMessage);
        if (typeof serviceFn !== 'function') {
            return callback(
                new Error(
                    `${behaviour.implementation ? 'Implementation' : 'Expression'}  did not resolve to a function`,
                ),
            );
        }
        serviceFn.call(activity, ExecutionScope(activity, executionMessage), callback);
    }
}

function BusinessRuleTaskDMNService(activity: any) {
    const { type: atype, behaviour, environment } = activity;
    const decisionRef = behaviour.decisionRef;
    const decisionRefBinding = behaviour.decisionRefBinding;
    const decisionRefVersion = behaviour.decisionRefVersion;
    const mapDecisionResult = behaviour.mapDecisionResult;
    const decisionRefTenantId = behaviour.decisionRefTenantId;
    const type = `DMN`;
    return {
        type,
        decisionRef,
        decisionRefBinding,
        decisionRefVersion,
        mapDecisionResult,
        decisionRefTenantId,
        execute,
    };
    function execute(executionMessage: any, callback: any) {
        const serviceFn = environment.services.evaluateDecision();
        const { fields, properties, content, ...input } = environment.variables;
        if (serviceFn) {
            executionMessage.content.decision = {
                decisionRef,
                decisionRefBinding,
                decisionRefVersion,
                mapDecisionResult,
                decisionRefTenantId,
                decisionContext: { input },
            };
            serviceFn.call(activity, ExecutionScope(activity, executionMessage), callback);
        } else {
            callback(new Error('BusinessRuleTaskDMN Service not found'));
        }

        // console.log(`BusinessRuleTaskDMNService executed`);
    }
}

export const BusinessRuleTaskExtension = (processInstance: BpmnProcessInstance | BpmnDefinitionInstance) => (
    activity: any,
) => {
    if (activity.type.toLowerCase() !== 'bpmn:BusinessRuleTask'.toLowerCase()) {
        return;
    }
    if (activity.behaviour.expression || activity.behaviour.implementation) {
        activity.behaviour.Service = BusinessRuleTaskService;
    } else if (activity.behaviour.decisionRef) {
        activity.behaviour.Service = BusinessRuleTaskDMNService;
    }
    if (activity.behaviour.resultVariable) {
        activity.on('end', (api: any) => {
            api.environment.output[activity.behaviour.resultVariable] = api.content.output;
        });
    }
    return;
};
