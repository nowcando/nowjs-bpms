import { BpmnProcessActivity, BpmnProcessInstance } from "../BpmnProcessInstance";


export const NowJsExtension = (processInstance: BpmnProcessInstance) =>
                  (activity: BpmnProcessActivity, definition: any) => {
    if (activity.type.toLowerCase() === "bpmn:Process".toLowerCase()) {
      if (
        activity.behaviour &&
        activity.behaviour.extensionElements &&
        activity.behaviour.extensionElements.values
      ) {
        for (const extn of activity.behaviour.extensionElements.values) {
          // process listener
          if (
            extn.$type.toLowerCase() ===
              "camunda:executionListener".toLowerCase() ||
            extn.$type.toLowerCase() ===
              "nowjs:executionListener".toLowerCase()
          ) {
            const lscript = extn && extn.script && extn.script.value;
            if (lscript) {
              try {
                const func = new Function("return " + lscript)();
                activity.on(extn.event, func);
              } catch (error) {
                activity.logger.error(
                  `error in parsing listener function.`,
                );
              }
            }
          }
        }
      }
    } else {
      if (!activity.behaviour.extensionElements) {
        return;
      }
      let form;
      const views: any = {};
      // activity listener
      for (const extn of activity.behaviour.extensionElements.values) {
        if (
          extn.$type.toLowerCase() ===
            "camunda:executionListener".toLowerCase() ||
          extn.$type.toLowerCase() ===
            "nowjs:executionListener".toLowerCase() ||
          extn.$type.toLowerCase() ===
            "camunda:taskListener".toLowerCase() ||
          extn.$type.toLowerCase() === "nowjs:taskListener".toLowerCase()
        ) {
          const lscript = extn && extn.script && extn.script.value;
          if (lscript) {
            try {
              const func = new Function("return " + lscript)();
              activity.on(extn.event, func);
            } catch (error) {
              activity.logger.error(
                `error in parsing listener function of ${activity.id}.`,
              );
            }
          }
        }

        if (
          extn.$type.toLowerCase() ===
            "camunda:DynamicView".toLowerCase() ||
          extn.$type.toLowerCase() === "nowjs:DynamicView".toLowerCase()
        ) {
          const view = extn && extn.script && extn.script.value;
          const viewType = "DynamicView";
          const name = extn.name || "default";
          const data = extn.data;
          views[name] = { name, view, viewType, data };
        }

        if (
          extn.$type.toLowerCase() === "camunda:FormData".toLowerCase() ||
          extn.$type.toLowerCase() === "nowjs:FormData".toLowerCase()
        ) {
          form = {
            fields: extn && extn.fields && extn.fields.map((f) => ({ ...f })),
          };
        }
      }

      activity.on("enter", () => {
        activity.broker.publish("format", "run.form", { form });
      });

      if (
        activity.type.toLowerCase() !== "bpmn:UserTask".toLowerCase() ||
        activity.type.toLowerCase() !== "bpmn:StartEvent".toLowerCase()
      ) {
        activity.on("wait", async (api: BpmnProcessActivity) => {
          const bpms = processInstance.BpmnEngine.BpmsEngine;
          if (bpms) {
            const t = await bpms.TaskService.createTask({
              name: api.name,
              refProcessInstanceId: processInstance.Id,
              refProcessId: api.environment.variables.content.id,
              refProcessExecutionId:
                api.environment.variables.content.executionId,
              refActivityId: api.id,
              refTenantId: bpms.Name,
              views,
            });
          }
        });
      }
    }
  };
