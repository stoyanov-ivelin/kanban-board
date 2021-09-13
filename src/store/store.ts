import { createReducer, createStore } from "@reduxjs/toolkit";
import { Skills } from "common/constants";
import {
  UPDATE_STATUS,
  CREATE_ISSUE,
  EDIT_ISSUE,
  CREATE_USER,
  EDIT_USER,
  CREATE_STATUS,
  DELETE_STATUS,
} from "common/actions";
import {
  CreateIssue,
  CreateStatus,
  CreateUser,
  DeleteStatus,
  EditIssue,
  EditUser,
  UpdateStatus,
} from "common/models";


export const deleteStatus = (state: RootState, action: DeleteStatus) => {
  const statusId = action.payload;
  const statusToDeleteIndex = state.statuses.findIndex(
    (status) => status.id === statusId
  );

  if (statusToDeleteIndex === -1) {
    throw new Error(`Status with id ${statusToDeleteIndex} does not exist`);
  } else {
    state.statuses.splice(statusToDeleteIndex, 1)
  }

  state.issues.forEach(issue => {
    if (issue.status && issue.status.id === statusId) {
      issue.status = null as any;
    }
  })

  state.boards.forEach((board) => {
    board.columns.forEach((column) => {
      column.statuses.forEach((status, index) => {
        if (status.id === statusId) {
          column.statuses.splice(index, 1);
        }
      });
    });
  });
};

export const InitialStatuses = {
  New: { id: 0, name: "new" },
  Commited: { id: 1, name: "commited" },
  InProgress: { id: 2, name: "in progress" },
  Done: { id: 3, name: "done" },
  Fixed: { id: 4, name: "fixed" },
};

const initialState = {
  issues: [
    {
      id: 0,
      title: "Learn Redux",
      description: "Read the official docs of Redux",
      status: InitialStatuses.New,
      assignee: "Ivan Ivanov",
    },
    {
      id: 1,
      title: "Setup project",
      description: "An empty React project with TS and Redux",
      status: InitialStatuses.New,
      assignee: "Rumen Stoychev",
    },
    {
      id: 2,
      title: "Implement Trello Board",
      description: "A Kanban board with drag-and-drop feature",
      status: InitialStatuses.New,
      assignee: "Alex Petrov",
    },
    {
      id: 3,
      title: "Submit code for review",
      description: "Open a new pull request",
      status: InitialStatuses.New,
      assignee: "Deyan Dimitrov",
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
      skills: [Skills.Java, Skills.Scala, Skills.JavaScript, Skills["C#"]],
    },
    {
      id: 1,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Rumen Stoychev",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: [Skills.GoLang, Skills["C#"], Skills.Java, Skills.JavaScript],
    },
    {
      id: 2,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Alex Petrov",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: [Skills.Java, Skills["C#"], Skills.Scala],
    },
    {
      id: 3,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Deyan Dimitrov",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: [
        Skills.JavaScript,
        Skills["C#"],
        Skills.GoLang,
        Skills.Java,
        Skills.Scala,
      ],
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
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(UPDATE_STATUS, (state: RootState, action: UpdateStatus) => {
      const index = action.payload.issueId;
      const newStatus = action.payload.newStatus;
      const issueToUpdate = state.issues.find((issue) => issue.id === index);

      if (issueToUpdate) {
        issueToUpdate.status = newStatus;
      }
    })
    .addCase(CREATE_ISSUE, (state: RootState, action: CreateIssue) => {
      const { title, description, assignee } = action.payload;
      const defaultStatus = state.statuses[0];

      const newIssue = {
        id: state.issues.length,
        title,
        description,
        status: defaultStatus,
        assignee,
      };

      state.issues.push(newIssue);
    })
    .addCase(EDIT_ISSUE, (state: RootState, action: EditIssue) => {
      const { id, title, description, assignee, status } = action.payload;
      const issueToEdit = state.issues.find((issue) => issue.id === id);

      if (issueToEdit) {
        issueToEdit.title = title;
        issueToEdit.description = description;
        issueToEdit.assignee = assignee;
        issueToEdit.status = status;
      }
    })
    .addCase(CREATE_USER, (state: RootState, action: CreateUser) => {
      const { profilePicture, jobPosition, name, description, skills } =
        action.payload;
      const newUser = {
        id: state.users.length,
        profilePicture,
        name,
        jobPosition,
        description,
        skills,
      };

      state.users.push(newUser);
    })
    .addCase(EDIT_USER, (state: RootState, action: EditUser) => {
      const { id, profilePicture, name, description, skills } = action.payload;
      const userToEdit = state.users.find((user) => user.id === id);

      if (userToEdit) {
        userToEdit.profilePicture = profilePicture;
        userToEdit.name = name;
        userToEdit.description = description;
        userToEdit.skills = skills;
      }
    })
    .addCase(CREATE_STATUS, (state: RootState, action: CreateStatus) => {
      const newStatus = {
        id: state.statuses.length,
        name: action.payload,
      };

      state.statuses.push(newStatus);
    })
    .addCase(DELETE_STATUS, deleteStatus)
    .addDefaultCase((state, action) => {});
});

export const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
