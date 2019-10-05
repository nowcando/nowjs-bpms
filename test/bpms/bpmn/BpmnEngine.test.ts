import { EventEmitter } from "events";
import "jest";
import { BpmnEngine, BpmnProcessActivity, BpmnProcessOptions, BpmsEngine } from "../../../src";

// tslint:disable:no-empty
beforeAll(() => {});
beforeEach(() => {});
afterEach(() => {});
afterAll(() => {});

describe("BpmnEngine", () => {
  describe("new", () => {
    it("should be instantiated BpmnEngine", () => {
      const actual = new BpmnEngine({ name: "MyEngine" });
      expect(actual).toBeDefined();
      expect(actual.Name).toBeDefined();
      expect(actual.Id).toBeDefined();
      expect(actual.createProcess).toBeDefined();
      expect(actual.registerDefinitions).toBeDefined();
    });
  });
  describe("new", () => {
    it("should be instantiated by createEngine static method", () => {
      const actual = new BpmnEngine({ name: "MyEngine" });
      expect(actual).toBeDefined();
      expect(actual.Name).toBeDefined();
      expect(actual.Id).toBeDefined();
      expect(actual.createProcess).toBeDefined();
      expect(actual.registerDefinitions).toBeDefined();
    });
  });
  describe("createEngine", () => {
    it("should be instantiated by createEngine static method", () => {
      const actual = BpmnEngine.createEngine({ name: "MyEngine1" });
      expect(actual).toBeDefined();
      expect(actual.Name).toBeDefined();
      expect(actual.Id).toBeDefined();
      expect(actual.createProcess).toBeDefined();
      expect(actual.registerDefinitions).toBeDefined();
    });
    it("should be instantiated by createEngine static method without options", () => {
      const actual = BpmnEngine.createEngine();
      expect(actual).toBeDefined();
    });
    // it("should be throw error while createEngine", () => {
    //   const actual = BpmsEngine.createEngine({ name: "MyEngine1" });
    //   expect(actual).toBeDefined();
    //   expect(BpmsEngine.createEngine({ name: "MyEngine1" })).toThrowError();
    // });
  });
  describe("createProcess", () => {
    it("should be instantiated a BpmnProcess by createProcess method", async () => {
      const bpe = BpmnEngine.createEngine({ name: "MyEngine1" });
      expect(bpe).toBeDefined();
      const actual = await bpe.createProcess();
      expect(actual).toBeDefined();
      expect(actual.Broker).toBeDefined();
      expect(actual.Name).toBeDefined();
      expect(actual.Environment).toBeDefined();
      expect(actual.State).toBeDefined();
      expect(actual.Stopped).toBeDefined();
      expect(actual.Execution).not.toBeDefined();
      expect(actual.State).toEqual("idle");
    });

    it("should be instantiated a BpmnProcess by createProcess method and execute", async () => {
      const bpe = BpmnEngine.createEngine({ name: "MyEngine1" });
      expect(bpe).toBeDefined();
      const id = Math.floor(Math.random() * 10000);
      const prOpts: BpmnProcessOptions = {
        name: "sampleProcess1",
        source: source1,
        variables: { id },
      };
      const pr = await bpe.createProcess(prOpts);
      expect(pr).toBeDefined();
      const execution = await pr.execute();
      expect(execution).toBeDefined();
      expect(execution.environment.variables.id).toEqual(id);
    });

    it("should be throw error while createProcess", async () => {
      const bpe = BpmnEngine.createEngine({ name: "MyEngine1" });
      expect(bpe).toBeDefined();
      const id = Math.floor(Math.random() * 10000);
      const prOpts: BpmnProcessOptions = {
        name: ["sampleProcess1"] as any,
        source: source1,
        variables: { id },
      };
      expect(bpe.createProcess(prOpts)).rejects.toThrow();
    });
  });
  describe("registerDefinitions", () => {
    it("should be registerDefinitions method return true", async () => {
      const bpe = BpmnEngine.createEngine({ name: "MyEngine1" });
      expect(bpe).toBeDefined();
      const actual1 = await bpe.registerDefinitions("sample1", source1);
      const actual2 = await bpe.registerDefinitions("sample2", source2);
      expect(actual1).toEqual(true);
      expect(actual2).toEqual(true);
    });
  });
  describe("persist", () => {
    it("should be persist all processes", async () => {
      const bpe = BpmnEngine.createEngine({ name: "MyEngine1" });
      expect(bpe).toBeDefined();
      const pr1 = await bpe.createProcess({
        name: "Process1",
        source: source1,
      });
      expect(pr1).toBeDefined();
      const prState1 = await pr1.getState();
      expect(prState1).toBeDefined();
      const pr2 = await bpe.createProcess({
        name: "Process2",
        source: source2,
      });
      expect(pr2).toBeDefined();
      const prState2 = await pr2.getState();
      expect(prState2).toBeDefined();
      // persist
      const presult1 = await bpe.persist();
      expect(presult1).toBeDefined();
      expect(presult1).toBeTruthy();
      const pCount = await bpe.ProcessPersistency.count();
      expect(pCount).toBeDefined();
      expect(pCount).toEqual(2);
    });

    it("should be recover all persisted processes", async () => {
      const bpe = BpmnEngine.createEngine({ name: "MyEngine1" });
      expect(bpe).toBeDefined();
      const pr1 = await bpe.createProcess({
        name: "Process1",
        source: source1,
      });
      expect(pr1).toBeDefined();
      const prState1 = await pr1.getState();
      expect(prState1).toBeDefined();
      const pr2 = await bpe.createProcess({
        name: "Process2",
        source: source2,
      });
      expect(pr2).toBeDefined();
      const prState2 = await pr2.getState();
      expect(prState2).toBeDefined();

      // process 3
      const pr3 = await bpe.createProcess({
        name: "Process3",
        source: source3,
      });
      expect(pr3).toBeDefined();
      const prState3 = await pr3.getState();
      expect(prState3).toBeDefined();

      // stop
      await bpe.stop(true);
      const l = await bpe.processList();
      expect(l.length).toBe(0);
      const c = await bpe.ProcessPersistency.count();
      expect(c).toBe(3);

      // recover persisted
      const r = await bpe.recover({resume: false});
      expect(r).toBe(true);
      const al1 = await bpe.processList();
      const ap1 = al1[0];
      expect(pr1.Id).toEqual(ap1.Id);
      expect(pr1.Name).toEqual(ap1.Name);
      const ap2 =  al1[1];
      expect(pr2.Id).toEqual(ap2.Id);
      const aps1 = ap1.State;
      expect(aps1).toEqual(pr1.State);
      const l1 = new EventEmitter();
      ap2.once("wait", (task) => {
        task.signal({
          ioSpecification: {
            dataOutputs: [
              {
                id: "userInput",
                value: "Saeed Tabrizi",
              },
            ],
          },
        });
      });
      // resume process 2
      const n2 = await ap2.resume();
      const s2 = await ap2.Environment.output;
      expect(n2).toBeDefined();
      expect(s2).toBeDefined();

      // resume process 3
      const ap3 =  al1[2];
      expect(pr3.Id).toEqual(ap3.Id);
      ap3.once("wait", (task: BpmnProcessActivity) => {
        ap3.Logger.warn(`${task.type} : ${task.name}`);
      });
      const n3 = await ap3.resume();
      const s3 = await ap3.Environment.output;
      expect(n3).toBeDefined();
      expect(s3).toBeDefined();
      // await ap2.stop();

    });
  });
});

const source1 = `
<?xml version="1.0" encoding="UTF-8"?>
  <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <process id="theProcess2" isExecutable="true">
    <startEvent id="theStart" />
    <exclusiveGateway id="decision" default="flow2" />
    <endEvent id="end1" />
    <endEvent id="end2" />
    <sequenceFlow id="flow1" sourceRef="theStart" targetRef="decision" />
    <sequenceFlow id="flow2" sourceRef="decision" targetRef="end1" />
    <sequenceFlow id="flow3" sourceRef="decision" targetRef="end2">
      <conditionExpression>true</conditionExpression>
    </sequenceFlow>
  </process>
</definitions>`;

const source2 = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <process id="theProcess" isExecutable="true">
    <dataObjectReference id="inputFromUserRef" dataObjectRef="inputFromUser" />
    <dataObject id="inputFromUser" />
    <startEvent id="theStart" />
    <userTask id="userTask">
      <ioSpecification id="inputSpec">
        <dataOutput id="userInput" name="sirname" />
      </ioSpecification>
      <dataOutputAssociation id="associatedWith" sourceRef="userInput" targetRef="inputFromUserRef" />
    </userTask>
    <endEvent id="theEnd" />
    <sequenceFlow id="flow1" sourceRef="theStart" targetRef="userTask" />
    <sequenceFlow id="flow2" sourceRef="userTask" targetRef="theEnd" />
  </process>
</definitions>`;
const source3 = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:nowjs="http://schema.nowcando.com/schema/bpmn/nowjs" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="4.0.0">
  <collaboration id="Collaboration_1sq9x60">
    <participant id="Participant_0460sze" name="ثبت کالا" processRef="Process_1" />
  </collaboration>
  <process id="Process_1" isExecutable="true">
    <laneSet id="LaneSet_0t4cm8w">
      <lane id="Lane_1eqasc7" name="کاربر">
        <flowNodeRef>StartEvent_1y45yut</flowNodeRef>
        <flowNodeRef>Task_1hcentk</flowNodeRef>
      </lane>
      <lane id="Lane_02dxm5t" name="مدیر" />
      <lane id="Lane_0ur75a6" name="سیستم">
        <flowNodeRef>Task_0mwibxl</flowNodeRef>
        <flowNodeRef>EndEvent_0dswgvl</flowNodeRef>
      </lane>
    </laneSet>
    <sequenceFlow id="SequenceFlow_0h21x7r" sourceRef="StartEvent_1y45yut" targetRef="Task_1hcentk" />
    <startEvent id="StartEvent_1y45yut" name="شروع">
      <outgoing>SequenceFlow_0h21x7r</outgoing>
    </startEvent>
    <userTask id="Task_1hcentk" name="فرم انتخاب">
      <extensionElements>
        <nowjs:dynamicUI updatedAt="2019-08-30T14:36:53.322Z">
          <nowjs:script language="typescript" updatedAt="2019-08-30T14:36:53.322Z">module.exports = {
        "activeViews":"main",
        "dataSources":{},
        "views":{
            "main":{
                elements:[
                    {type:"singleText",title:"Firstname"},
                    {type:"singleText",title:"Lastname"},

                    ]
            },
        }
    }</nowjs:script>
        </nowjs:dynamicUI>
      </extensionElements>
      <incoming>SequenceFlow_0h21x7r</incoming>
      <outgoing>SequenceFlow_09u0si2</outgoing>
    </userTask>
    <sequenceFlow id="SequenceFlow_09u0si2" sourceRef="Task_1hcentk" targetRef="Task_0mwibxl" />
    <sequenceFlow id="SequenceFlow_1z0p9j1" sourceRef="Task_0mwibxl" targetRef="EndEvent_0dswgvl" />
    <task id="Task_0mwibxl" name="ثبت در پایگاه داده">
      <incoming>SequenceFlow_09u0si2</incoming>
      <outgoing>SequenceFlow_1z0p9j1</outgoing>
    </task>
    <endEvent id="EndEvent_0dswgvl" name="پایان">
      <incoming>SequenceFlow_1z0p9j1</incoming>
    </endEvent>
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Collaboration_1sq9x60">
      <bpmndi:BPMNShape id="Participant_0460sze_di" bpmnElement="Participant_0460sze" isHorizontal="true">
        <omgdc:Bounds x="72" y="-5" width="768" height="305" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
        <omgdc:Bounds x="152" y="32" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="156" y="8" width="27" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1hcentk_di" bpmnElement="Task_1hcentk">
        <omgdc:Bounds x="300" y="10" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0h21x7r_di" bpmnElement="SequenceFlow_0h21x7r">
        <omgdi:waypoint x="188" y="50" />
        <omgdi:waypoint x="300" y="50" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Lane_1eqasc7_di" bpmnElement="Lane_1eqasc7" isHorizontal="true">
        <omgdc:Bounds x="102" y="-5" width="738" height="106" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_02dxm5t_di" bpmnElement="Lane_02dxm5t" isHorizontal="true">
        <omgdc:Bounds x="102" y="101" width="738" height="79" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Lane_0ur75a6_di" bpmnElement="Lane_0ur75a6" isHorizontal="true">
        <omgdc:Bounds x="102" y="180" width="738" height="120" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_0mwibxl_di" bpmnElement="Task_0mwibxl">
        <omgdc:Bounds x="480" y="210" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_09u0si2_di" bpmnElement="SequenceFlow_09u0si2">
        <omgdi:waypoint x="400" y="50" />
        <omgdi:waypoint x="530" y="50" />
        <omgdi:waypoint x="530" y="210" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_0dswgvl_di" bpmnElement="EndEvent_0dswgvl">
        <omgdc:Bounds x="632" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="640" y="275" width="21" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1z0p9j1_di" bpmnElement="SequenceFlow_1z0p9j1">
        <omgdi:waypoint x="580" y="250" />
        <omgdi:waypoint x="632" y="250" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
