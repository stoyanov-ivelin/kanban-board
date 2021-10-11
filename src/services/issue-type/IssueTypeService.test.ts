import { IssueTypeService } from "services/issue-type/IssueTypeService";
import { InitialStatuses } from "store/store";
import { StateBuilder } from "store/StateBuilder";
import "reflect-metadata";

const builder = StateBuilder.get();
const service = new IssueTypeService();

describe("IssueTypeService", () => {
  describe("checkForErrorOnAdd", () => {
    const { types } = builder.build();

    it("should return the error if the name is not between 3 and 50 characters", () => {
      const name = "er";

      const result = service.checkForErrorOnAdd(name, types);

      expect(result).toBeTruthy();
    });
    it("should return null if the name is between 3 and 50 characters", () => {
      const name = "correct";

      const result = service.checkForErrorOnAdd(name, types);

      expect(result).toBeNull();
    });
    it("should return the error if a type with this name already exists", () => {
      const name = "feature";

      const result = service.checkForErrorOnAdd(name, types);

      expect(result).toBeTruthy();
    });
  });
  describe("checkForErrorOnEdit", () => {
    const { issues, workflows, types } = builder.build();
    const workflow = "default";
    const typeIndex = 0;

    it("should return the error if the name is not between 3 and 50 characters", () => {
      const name = "er";

      const result = service.checkForErrorOnEdit(
        typeIndex,
        name,
        workflow,
        types,
        issues,
        workflows
      );

      expect(result).toBeTruthy();
    });
    it("should return null if the name is between 3 and 50 characters", () => {
      const name = "correct";

      const result = service.checkForErrorOnEdit(
        typeIndex,
        name,
        workflow,
        types,
        issues,
        workflows
      );

      expect(result).toBeNull();
    });
    it("should return the error if a type with this name already exists", () => {
      const name = "bug";

      const result = service.checkForErrorOnEdit(
        typeIndex,
        name,
        workflow,
        types,
        issues,
        workflows
      );

      expect(result).toBeTruthy();
    });
    it("should return the error if there's an issue of this type with a status that's not included in the new workflow's transitions", () => {
      const correctTransitions = new Map();
      correctTransitions.set(InitialStatuses.New, InitialStatuses.Done);
      correctTransitions.set(InitialStatuses.Done, InitialStatuses.New);
      const errorTransitions = new Map();
      errorTransitions.set(InitialStatuses.Done, InitialStatuses.Fixed);
      errorTransitions.set(InitialStatuses.Fixed, InitialStatuses.Done);
      const mockIssues = [
        {
          id: 0,
          title: "test",
          description: "test",
          status: InitialStatuses.New,
          assignee: "Pete",
          type: "feature",
        },
      ];
      const mockWorkflows = [
        {
          name: "correct",
          transitions: correctTransitions,
        },
        {
          name: "error",
          transitions: errorTransitions,
        },
      ];
      const { issues, workflows, types } = builder
        .withIssues(mockIssues)
        .withWorkflows(mockWorkflows)
        .build();
      const typeIndex = 0;
      const workflow = "error";
      const name = "feature";

      const result = service.checkForErrorOnEdit(
        typeIndex,
        name,
        workflow,
        types,
        issues,
        workflows
      );

      expect(result).toBeTruthy();
    });
  });
});
describe("checkForErrorOnDelete", () => {
  const type = "feature";

  it("should return the error if there is an existing issue of this type", () => {
    const mockIssues = [
      {
        id: 0,
        title: "test",
        description: "test",
        status: InitialStatuses.New,
        assignee: "Pete",
        type: "feature",
      },
    ];
    const { issues } = builder.withIssues(mockIssues).build();

    const hasErrors = service.checkForErrorOnDelete(type, issues);

    expect(hasErrors).toBeTruthy();
  });
  it("should return null if there is no existing issue of this type", () => {
    const mockIssues = [
      {
        id: 0,
        title: "test",
        description: "test",
        status: InitialStatuses.New,
        assignee: "Pete",
        type: "bug",
      },
    ];
    const { issues } = builder.withIssues(mockIssues).build();

    const hasErrors = service.checkForErrorOnDelete(type, issues);

    expect(hasErrors).toBeNull();
  });
});