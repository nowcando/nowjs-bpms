import "jest";
import * as path from "path";
import { BpmsEngine } from "../../src";

// tslint:disable:no-empty
beforeAll(() => {});
beforeEach(() => {
  BpmsEngine.reset();
});
afterEach(() => {});
afterAll(() => {});

describe("BpmsEngine", () => {
  describe("new", () => {
    it("should be instantiated BpmsEngine", () => {
      const actual = new BpmsEngine({ name: "MyEngine" });
      expect(actual).toBeDefined();
      expect(actual.Name).toBeDefined();
      expect(actual.Id).toBeDefined();
      expect(actual.BpmnEngine).toBeDefined();
      expect(actual.DmnEngine).toBeDefined();
      expect(actual.CmmnEngine).toBeDefined();
    });
  });
  describe("createEngine", () => {
    it("should be instantiated by createEngine static method", () => {
      const actual = BpmsEngine.createEngine({ name: "MyEngine1" });
      expect(actual).toBeDefined();
      expect(actual.Name).toBeDefined();
      expect(actual.Id).toBeDefined();
      expect(actual.BpmnEngine).toBeDefined();
      expect(actual.DmnEngine).toBeDefined();
      expect(actual.CmmnEngine).toBeDefined();
    });
    it("should be instantiated by createEngine static method without cache", () => {
      const actual = BpmsEngine.createEngine({
        name: "MyEngine1",
        cache: false,
      });
      expect(actual).toBeDefined();
    });
    it("should be instantiated by createEngine static method with cache", () => {
      const actual = BpmsEngine.createEngine({
        name: "MyEngine1",
        cache: true,
      });
      expect(actual).toBeDefined();
    });
    it("should be instantiated by createEngine static method without options", () => {
      const actual = BpmsEngine.createEngine();
      expect(actual).toBeDefined();
    });
    it("should be throw error while createEngine", () => {
      const actual = BpmsEngine.createEngine({ name: "MyEngine1" });
      expect(actual).toBeDefined();
      expect(() => BpmsEngine.createEngine({ name: "MyEngine1" })).toThrowError();
    });
  });
  describe("reset", () => {
    it("should be reset", () => {
      BpmsEngine.createEngine({ name: "MyEngine1" });
      BpmsEngine.reset();
      const actual = BpmsEngine.createEngine({ name: "MyEngine1" });
      expect(actual).toBeDefined();
    });
  });
  describe("list", () => {
    it("should be list and return 2 items", () => {
      BpmsEngine.createEngine({ name: "MyEngine1" });
      BpmsEngine.createEngine({ name: "MyEngine2" });
      const actual = BpmsEngine.list();
      expect(actual).toBeDefined();
      expect(actual.length).toEqual(2);
      expect(actual[0].Name).toEqual("MyEngine1");
      expect(actual[1].Name).toEqual("MyEngine2");
    });
  });
});
