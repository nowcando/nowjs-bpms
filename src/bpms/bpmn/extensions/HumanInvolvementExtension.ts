/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BpmnProcessInstance } from '../BpmnProcessInstance';
import { BpmnActivity } from '../definitions/bpmn-elements';

export const HumanInvolvementExtension = (processInstance: BpmnProcessInstance) => (activity: BpmnActivity) => {
    if (!activity.behaviour.resources || !activity.behaviour.resources.length) {
        return;
    }

    const humanPerformer = activity.behaviour.resources.find(
        (resource: any) => resource.type === 'bpmn:HumanPerformer',
    );
    const potentialOwner = activity.behaviour.resources.find(
        (resource: any) => resource.type === 'bpmn:PotentialOwner',
    );

    activity.on('enter', api => {
        const h = api.resolveExpression(humanPerformer.expression);
        const p = api.resolveExpression(potentialOwner.expression);
        activity.broker.publish('format', 'run.call.humans', {
            humanPerformer: h,
            potentialOwner: p,
        });
    });

    activity.on('wait', api => {
        api.owner.broker.publish('event', 'activity.call', {
            ...api.content,
        });
    });
};
