/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BpmnProcessInstance } from '../BpmnProcessInstance';

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
        const serviceFn = environment.resolveExpression(expression, executionMessage);
        if (typeof serviceFn !== 'function') {
            return callback(
                new Error(
                    `${behaviour.implementation ? 'Implementation' : 'Expression'}  did not resolve to a function`,
                ),
            );
        }
        serviceFn.call(activity, executionMessage, (err: any, result: any) => {
            callback(err, result);
        });
    }
}

export const BusinessRuleTaskExtension = (processInstance: BpmnProcessInstance) => (activity: any) => {
    if (activity.type.toLowerCase() !== 'bpmn:BusinessRuleTask'.toLowerCase()) {
        return;
    }
    if (activity.behaviour.expression || activity.behaviour.implementation) {
        activity.behaviour.Service = BusinessRuleTaskService;
    }
    if (activity.behaviour.resultVariable) {
        activity.on('end', (api: any) => {
            activity.environment.output[activity.behaviour.resultVariable] = api.content.output;
        });
    }
};

// evaluateDecision(activity: BpmnProcessActivity) {
//   if (
//     activity.type.toLowerCase() !== "bpmn:BusinessRuleTask".toLowerCase()
//   ) {
//     return;
//   }
//   const dmnRef = activity.behaviour.dmnRef;
//   const decisionRef = activity.behaviour.decisionRef;
//   const decisionRefTenantId = activity.behaviour.decisionRefTenantId;
//   // activity.on("enter", (api: BpmnProcessActivity) => {
//   //   // console.log(activity.id);
//   // });
//   activity.on("wait", async (api: BpmnProcessActivity) => {
//     // console.log(activity.id);
//     if (dmnRef && decisionRef) {
//       try {
//         const ctx = { input: api.environment.variables };
//         const eoptions =  {dmnRef, decisionRef, ctx};
//         const msg = await api.environment.services.evaluateDecision(eoptions);
//         api.signal(msg);
//       } catch (error) {
//         api.environment.Logger.error(
//           `error in evaluating decision in 'bpmn:BusinessRuleTask' (${api.id})`,
//         );
//       }
//     }
//   });
// },
