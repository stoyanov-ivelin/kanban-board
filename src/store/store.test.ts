import {
  CREATE_WORKFLOW,
  DELETE_STATUS,
  DELETE_WORKFLOW,
  EDIT_WORKFLOW,
} from "common/actions";
import { StateBuilder } from "store/StateBuilder";
import {
  createWorkflow,
  deleteStatus,
  deleteWorkflow,
  editWorkflow,
  InitialStatuses,
} from "store/store";

const builder = StateBuilder.get();

describe("deleteStatus", () => {
  const deleteStatusAction = {
    type: DELETE_STATUS,
    payload: 2,
  };

  it("should delete in progress status from statuses", () => {
    const mockState = builder.build();

    deleteStatus(mockState, deleteStatusAction);

    expect(mockState.statuses).toHaveLength(4);
  });

  it("should replace in progress status with null in issue", () => {
    const mockIssues = [
      {
        id: 1,
        title: "Setup project",
        description: "An empty React project with TS and Redux",
        status: InitialStatuses.InProgress,
        assignee: "Rumen Stoychev",
      },
    ];
    const mockState = builder.withIssues(mockIssues).build();

    deleteStatus(mockState, deleteStatusAction);

    expect(mockState.issues[0].status).toBe(null);
  });

  it("should remove in progress status from all board columns", () => {
    const mockBoards = [
      {
        name: "test",
        columns: [
          { name: "In Progress", statuses: [InitialStatuses.InProgress] },
        ],
      },
    ];
    const mockState = builder.withBoards(mockBoards).build();
    const expectedOutput = [
      {
        name: "test",
        columns: [{ name: "In Progress", statuses: [] }],
      },
    ];

    deleteStatus(mockState, deleteStatusAction);

    expect(mockState.boards).toEqual(expectedOutput);
  });

  it("should not change board columns if there is no column with in progress status", () => {
    const mockBoards = [
      {
        name: "test",
        columns: [{ name: "Todo", statuses: [InitialStatuses.New] }],
      },
    ];
    const mockStatuses = [
      InitialStatuses.New,
      InitialStatuses.Commited,
      InitialStatuses.Done,
      InitialStatuses.Fixed,
    ];
    const mockState = builder.withBoards(mockBoards).build();
    const expectedState = builder
      .withBoards(mockBoards)
      .withStatuses(mockStatuses)
      .build();

    deleteStatus(mockState, deleteStatusAction);

    expect(mockState).toEqual(expectedState);
  });

  it("should throw if in progress status does not exist", () => {
    const mockState = builder.build();

    mockState.statuses.splice(2, 1);

    expect(() => deleteStatus(mockState, deleteStatusAction)).toThrow(
      `Status with id 2 does not exist`
    );
  });
});

describe("Workflow Actions", () => {
  const testWorkflowTransitions = new Map();
  testWorkflowTransitions.set(InitialStatuses.New, [InitialStatuses.Done]);
  testWorkflowTransitions.set(InitialStatuses.Commited, []);
  testWorkflowTransitions.set(InitialStatuses.InProgress, []);
  testWorkflowTransitions.set(InitialStatuses.Done, []);
  testWorkflowTransitions.set(InitialStatuses.Fixed, []);

  describe("createWorkflow", () => {
    const payload = {
      name: "test",
      transitions: [[InitialStatuses.Done]],
    };

    const createWorkflowAction = {
      type: CREATE_WORKFLOW,
      payload,
    };

    it("should create a new workflow with the passed name and transitions", () => {
      const mockState = builder.build();
      const mockWorkflow = {
        name: "test",
        transitions: testWorkflowTransitions,
      };

      const expectedState = builder.build();
      expectedState.workflows.push(mockWorkflow);
      createWorkflow(mockState, createWorkflowAction);

      expect(mockState).toEqual(expectedState);
    });
  });

  describe("editWorkflow", () => {
    const payload = {
      index: 1,
      name: "newName",
      transitions: [[InitialStatuses.Fixed]],
    };

    const editWorkflowAction = {
      type: EDIT_WORKFLOW,
      payload,
    };

    it("should throw if there is no workflow at the passed index", () => {
      const mockWorkflows = [
        {
          name: "failedTest",
          transitions: new Map(),
        },
      ];
      const mockState = builder.withWorkflows(mockWorkflows).build();

      expect(() => editWorkflow(mockState, editWorkflowAction)).toThrow();
    });

    it("should edit the name and transitions of the workflow at the passed index", () => {
      const mockWorkflows = [
        {
          name: "test",
          transitions: new Map(),
        },
        {
          name: "test1",
          transitions: testWorkflowTransitions,
        },
      ];
      const mockState = builder.withWorkflows(mockWorkflows).build();
      const expectedState = builder.withWorkflows(mockWorkflows).build();
      expectedState.workflows[1].transitions.set(InitialStatuses.New, [
        InitialStatuses.Fixed,
      ]);
      expectedState.workflows[1].name = "newName";

      editWorkflow(mockState, editWorkflowAction);

      expect(mockState).toEqual(expectedState);
    });
  });

  describe("deleteWorkflow", () => {
    const payload = {
      name: "test",
    };

    const deleteWorkflowAction = {
      type: DELETE_WORKFLOW,
      payload,
    };

    it("should throw if there is no workflow with the passed name", () => {
      const mockState = builder.build();

      expect(() => deleteWorkflow(mockState, deleteWorkflowAction)).toThrow();
    });

    it("should delete the workflow with the passed name", () => {
      const mockWorkflows = [
        {
          name: "test",
          transitions: new Map(),
        },
      ];
      const mockState = builder.withWorkflows(mockWorkflows).build();
      const expectedState = builder.withWorkflows(mockWorkflows).build();
      expectedState.workflows.splice(0, 1);

      deleteWorkflow(mockState, deleteWorkflowAction);

      expect(mockState).toEqual(expectedState);
    });
  });
});
