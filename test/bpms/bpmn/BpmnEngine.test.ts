import "jest";
import { BpmnEngine, BpmnProcessOptions } from "../../../src";

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
        variables: {id},
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
        variables: {id},
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
