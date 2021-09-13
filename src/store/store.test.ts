import { Skills } from "common/constants";
import { IColumn, IIssue } from "common/models";
import { deleteStatus, InitialStatuses } from "store/store";

const defaultColumns = [
  {
    name: "Todo",
    statuses: [InitialStatuses.New, InitialStatuses.Commited],
  },
  { name: "In Progress", statuses: [InitialStatuses.InProgress] },
  {
    name: "Done",
    statuses: [InitialStatuses.Done, InitialStatuses.Fixed],
  },
];

const defaultIssues = [
  {
    id: 0,
    title: "Learn Redux",
    description: "Read the official docs of Redux",
    status: InitialStatuses.New,
    assignee: "Ivan Ivanov",
  },
];

const getMockState = (
  columns: Array<IColumn> = defaultColumns,
  issues: Array<IIssue> = defaultIssues
) => ({
  issues,
  users: [
    {
      id: 0,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Ivan Ivanov",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: [Skills.Java],
    },
  ],
  boards: [
    {
      name: "Default",
      columns,
    },
  ],
  statuses: [
    InitialStatuses.New,
    InitialStatuses.Commited,
    InitialStatuses.InProgress,
    InitialStatuses.Done,
    InitialStatuses.Fixed,
  ],
});

const action = {
  type: "DELETE_STATUS",
  payload: 2,
};

describe("deleteStatus", () => {
  it("should delete in progress status from statuses", () => {
    const mockState = getMockState();

    deleteStatus(mockState, action);

    const expectedOutput = [
      InitialStatuses.New,
      InitialStatuses.Commited,
      InitialStatuses.Done,
      InitialStatuses.Fixed,
    ];

    expect(mockState.statuses).toEqual(expectedOutput);
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

    const mockState = getMockState(defaultColumns, mockIssues);

    deleteStatus(mockState, action);

    expect(mockState.issues[0].status).toBe(null);
  });

  it("should remove in progress status from all board columns", () => {
    const mockColumns = [
      { name: "In Progress", statuses: [InitialStatuses.InProgress] },
    ];
    const mockState = getMockState(mockColumns);

    deleteStatus(mockState, action);

    const expectedOutput = [
      {
        name: "Default",
        columns: [{ name: "In Progress", statuses: [] }],
      },
    ];

    expect(mockState.boards).toEqual(expectedOutput);
  });

  it("should not change board columns if there is no column with in progress status", () => {
    const mockColumns = [
      { name: "Todo", statuses: [InitialStatuses.New] },
    ];

    const mockState = getMockState(mockColumns);

    deleteStatus(mockState, action);

    expect(mockState).toEqual(mockState);
  });

  it("should throw if in progress status does not exist", () => {
    const mockState = getMockState();
    mockState.statuses.splice(2, 1);

    expect(() => deleteStatus(mockState, action)).toThrow('Status does not exist');
  });
});
