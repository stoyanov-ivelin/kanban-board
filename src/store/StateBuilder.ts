import { Skills } from "common/constants";
import { IBoard, IIssue, IStatus, IWorkflow } from "common/models";
import { InitialStatuses, RootState } from "store/store";
import _ from "lodash";

const transitions = new Map();
transitions.set(InitialStatuses.New, [InitialStatuses.Commited]);

const mockState = {
  issues: [
    {
      id: 0,
      title: "Learn Redux",
      description: "Read the official docs of Redux",
      status: InitialStatuses.New,
      assignee: "Ivan Ivanov",
    },
  ],
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
      columns: [
        {
          name: "Todo",
          statuses: [InitialStatuses.New, InitialStatuses.Commited],
        },
        { name: "In Progress", statuses: [InitialStatuses.InProgress] },
        {
          name: "Done",
          statuses: [InitialStatuses.Done, InitialStatuses.Fixed],
        },
      ],
    },
  ],
  statuses: [
    InitialStatuses.New,
    InitialStatuses.Commited,
    InitialStatuses.InProgress,
    InitialStatuses.Done,
    InitialStatuses.Fixed,
  ],
  workflows: [
    {
      name: "default",
      transitions,
    },
  ],
};

export class StateBuilder {
  private static defaultValues: RootState = mockState;

  static get(): StateBuilder {
    return new StateBuilder(StateBuilder.defaultValues);
  }

  private constructor(private state: RootState) {}

  private with(newState: Partial<RootState>): StateBuilder {
    return new StateBuilder({ ...this.state, ...newState });
  }

  withIssues(issues: Array<IIssue>): StateBuilder {
    return this.with({ issues });
  }

  withBoards(boards: Array<IBoard>): StateBuilder {
    return this.with({ boards });
  }

  withStatuses(statuses: Array<IStatus>): StateBuilder {
    return this.with({ statuses });
  }

  withWorkflows(workflows: Array<IWorkflow>): StateBuilder {
    return this.with({ workflows });
  }

  build(): RootState {
    return _.cloneDeep(this.state);
  }
}
