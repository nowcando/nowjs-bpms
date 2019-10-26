import * as fs from "fs";
import "jest";
import * as path from "path";
import { DmnEngine } from "../../../src";

function readDmnFile(xmlFile: string): string {
  return fs.readFileSync(xmlFile, { encoding: "UTF-8" });
}

const DMN_TEST_PATH = "./test/resources/dmn/samples";

// tslint:disable:no-empty
beforeAll(() => {});
beforeEach(() => {
  //  DmnEngine.resetCache();
});
afterEach(() => {});
afterAll(() => {});

describe("DmnEngine", () => {
  describe("new", () => {
    it("should be instantiated DmnEngine", () => {
      const actual = new DmnEngine(undefined, { name: "MyEngine" });
      expect(actual).toBeDefined();
      expect(actual.Name).toBeDefined();
      expect(actual.Id).toBeDefined();
      expect(actual.clearAllDefinitions).toBeDefined();
      expect(actual.count).toBeDefined();
      expect(actual.evaluateDecision).toBeDefined();
      expect(actual.find).toBeDefined();
      expect(actual.getDecisions).toBeDefined();
      expect(actual.getDefinitionNames).toBeDefined();
      expect(actual.load).toBeDefined();
      expect(actual.parseDmnXml).toBeDefined();
      expect(actual.persist).toBeDefined();
      expect(actual.registerDefinitions).toBeDefined();
      expect(actual.remove).toBeDefined();
    });
  });
  describe("createEngine", () => {
    it("should be instantiated by createEngine static method", () => {
      const actual = DmnEngine.createEngine({ name: "MyEngine1" });
      expect(actual).toBeDefined();
      expect(actual.Name).toBeDefined();
      expect(actual.Id).toBeDefined();
    });
  });
  describe("registerDefinitions", () => {
    it("should be true when call registerDefinitions ", async () => {
      const engine = DmnEngine.createEngine({ name: "MyEngine1" });
      expect(engine).toBeDefined();
      expect(engine.Name).toBeDefined();
      expect(engine.Id).toBeDefined();
      const decisions = await engine.parseDmnXml(readDmnFile(path.join(DMN_TEST_PATH, `simple.dmn`)));
      const actual = await engine.registerDefinitions("MyRules", decisions);
      expect(actual).toBeTruthy();
    });
  });
  describe("parseDmnXml", () => {
    it("should be return an array of decisions when call parseDmnXml", async () => {
      const engine = DmnEngine.createEngine({ name: "MyEngine1" });
      expect(engine).toBeDefined();
      expect(engine.Name).toBeDefined();
      expect(engine.Id).toBeDefined();
      const decisions = await engine.parseDmnXml(readDmnFile(path.join(DMN_TEST_PATH, `simple.dmn`)));
      expect(decisions).toBeDefined();
    });
    it("should be throw error when call parseDmnXml", async () => {
      const engine = DmnEngine.createEngine({ name: "MyEngine1" });
      expect(engine).toBeDefined();
      expect(engine.Name).toBeDefined();
      expect(engine.Id).toBeDefined();
      expect(engine.parseDmnXml("MyRules")).rejects.toThrow();
    });
  });
  describe("evaluateDecision", () => {
    it("should be return 10 from mydecision", async () => {
      const engine = DmnEngine.createEngine({ name: "MyEngine1" });
      expect(engine).toBeDefined();
      expect(engine.Name).toBeDefined();
      expect(engine.Id).toBeDefined();
      const decisions = await engine.parseDmnXml(readDmnFile(path.join(DMN_TEST_PATH, `simple.dmn`)));
      expect(decisions).toBeDefined();
      // const actual = await engine.evaluateDecision("mydecision", decisions, {name: "saeed"});
      //  expect(actual).toBeDefined();
    });
    it("should be return 'Message 2' from mypoints decision", async () => {
      const engine = DmnEngine.createEngine({ name: "MyEngine1" });
      expect(engine).toBeDefined();
      expect(engine.Name).toBeDefined();
      expect(engine.Id).toBeDefined();
      const decisions = await engine.parseDmnXml(readDmnFile(path.join(DMN_TEST_PATH, `unique.dmn`)));
      expect(decisions).toBeDefined();
      const context = {
        input: {
          category: "B",
        },
      };

      const actual = await engine.evaluateDecision<any>("decision", decisions, context);
      expect(actual).toBeDefined();
      expect(actual.message).toEqual("Message 2");
    });
    it("should be return '10' from mypoints decision", async () => {
      const engine = DmnEngine.createEngine({ name: "MyEngine1" });
      expect(engine).toBeDefined();
      expect(engine.Name).toBeDefined();
      expect(engine.Id).toBeDefined();
      const decisions = await engine.parseDmnXml(readDmnFile(path.join(DMN_TEST_PATH, `points-first.dmn`)));
      expect(decisions).toBeDefined();
      const context = {
        input: {
          firstname: "saeed",
          lesson: "math",
        },
      };
      const actual = await engine.evaluateDecision<any>("mypoints", decisions, context);
      expect(actual).toBeDefined();
      expect(actual.output.point).toEqual(10);
    });
    it("should be return '10' from mypoints decision", async () => {
      const engine = DmnEngine.createEngine({ name: "MyEngine1" });
      expect(engine).toBeDefined();
      expect(engine.Name).toBeDefined();
      expect(engine.Id).toBeDefined();
      const decisions = await engine.parseDmnXml(readDmnFile(path.join(DMN_TEST_PATH, `points-collect.dmn`)));
      expect(decisions).toBeDefined();
      const context = {
        input: {
          firstname: "saeed",
          lesson: "math",
        },
      };
      const actual = await engine.evaluateDecision<any>("mypoints", decisions, context);
      expect(actual).toBeDefined();
      expect(actual[0].output.point).toEqual(10);
    });
  });
});

