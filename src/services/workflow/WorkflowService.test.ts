import { WorkflowService } from "services/workflow/WorkflowService";
import { InitialStatuses } from "store/store";
import "reflect-metadata";
import { IStatus } from "common/models";
import { StateBuilder } from "store/StateBuilder";

const s = InitialStatuses;
const mockTransitions = new Map();
mockTransitions.set(s.New, [s.InProgress, s.Done]);

describe("WorkflowService", () => {
  afterEach(() => {
    mockTransitions.clear();
    mockTransitions.set(s.New, [s.InProgress, s.Done]);
  });

  describe("parseTransitionsToKeyValuePair", () => {
    const expectedOutput = [
      `${s.New.name};${s.InProgress.name}, ${s.Done.name}`,
    ];

    it("should parse the transitions map to a key/value pair array", () => {
      const result = new WorkflowService().parseTransitionsToKeyValuePair(
        mockTransitions
      );

      expect(result).toEqual(expectedOutput);
    });
    it("should parse an empty array in the transitions map to an empty string", () => {
      mockTransitions.set(s.Done, []);
      expectedOutput.push(`${s.Done.name};`);

      const result = new WorkflowService().parseTransitionsToKeyValuePair(
        mockTransitions
      );

      expect(result).toEqual(expectedOutput);
    });
  });

  describe("getAllValuesOfTransitionsMap", () => {
    const expectedOutput = [[s.InProgress, s.Done]];

    it("should return an array of all values of the transitions map", () => {
      const result = new WorkflowService().getAllValuesOfTransitionsMap(
        mockTransitions
      );

      expect(result).toEqual(expectedOutput);
    });
    it("should return an empty array for an empty array value in the transitions map", () => {
      mockTransitions.set(s.New, []);

      const result = new WorkflowService().getAllValuesOfTransitionsMap(
        mockTransitions
      );

      expect(result).toContainEqual([]);
    });
  });

  describe("parseTransitionsToStringArray", () => {
    it("should return an array of arrays with the names of statuses for each value in the transition map", () => {
      mockTransitions.set(s.InProgress, []);
      const mockWorkflow = {
        name: "default",
        transitions: mockTransitions,
      };
      const expectedOutput = [["in progress", "done"], []];

      const result = new WorkflowService().parseTransitionsToStringArray(
        mockWorkflow
      );

      expect(result).toEqual(expectedOutput);
    });
  });

  describe("checkForDeadEndStatuses", () => {
    const mockStatuses = [s.New, s.InProgress];

    it("should return an empty array if transitions array is an array of empty arrays", () => {
      const mockTransitions: Array<Array<IStatus>> = [[], []];

      const result = new WorkflowService().checkForDeadEndStatuses(
        mockTransitions,
        mockStatuses
      );

      expect(result).toEqual([]);
    });
    it("should return an array of statuses if there are dead end statuses", () => {
      const mockTransitions: Array<Array<IStatus>> = [[s.InProgress], [s.Done]];
      const deadEndStatus = InitialStatuses.New;

      const result = new WorkflowService().checkForDeadEndStatuses(
        mockTransitions,
        mockStatuses
      );

      expect(result).toContain(deadEndStatus);
    });
    it("should return unedfined if there are no dead end statuses", () => {
      const mockTransitions: Array<Array<IStatus>> = [[s.InProgress], [s.New]];

      const result = new WorkflowService().checkForDeadEndStatuses(
        mockTransitions,
        mockStatuses
      );

      expect(result).toBe(undefined);
    });
  });

  describe("checkForErrorOnDelete", () => {
    it("should return the error if the workflow is currently assigned to any type", () => {
      const { workflows, types } = StateBuilder.get().build();

      const result = new WorkflowService().checkForErrorOnDelete(
        workflows[0].name,
        types
      );

      expect(result).toBeTruthy();
    });
    it("should return null if the workflow is currently not assigned to any type", () => {
      const mockTypes = [{ name: "bug", workflow: "test" }];
      const { workflows, types } = StateBuilder.get()
        .withTypes(mockTypes)
        .build();

      const result = new WorkflowService().checkForErrorOnDelete(
        workflows[0].name,
        types
      );

      expect(result).toBeNull();
    });
  });
});
