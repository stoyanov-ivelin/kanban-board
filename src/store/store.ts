import { AnyAction, createStore, Dispatch } from "@reduxjs/toolkit";
import { UPDATE_STATUS, CREATE_ISSUE } from "common/actions";
import { CreateIssue, UpdateStatus } from "common/models";

const initialState = {
  issues: [
    {
      id: 0,
      name: "Learn Redux",
      description: "Read the official docs of Redux",
      status: "New",
      assignee: "Ivan Ivanov",
    },
    {
      id: 1,
      name: "Setup project",
      description: "An empty React project with TS and Redux",
      status: "New",
      assignee: "Rumen Stoychev",
    },
    {
      id: 2,
      name: "Implement Trello Board",
      description: "A Kanban board with drag-and-drop feature",
      status: "New",
      assignee: "Alex Petrov",
    },
    {
      id: 3,
      name: "Submit code for review",
      description: "Open a new pull request",
      status: "New",
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
      skills: ["Java", "C#", "Scala", "GoLang"],
    },
    {
      id: 0,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Rumen Stoychev",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: ["Java", "C#", "Scala", "GoLang"],
    },
    {
      id: 0,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Alex Petrov",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: ["Java", "C#", "Scala", "GoLang"],
    },
    {
      id: 0,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Deyan Dimitrov",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: ["Java", "C#", "Scala", "GoLang"],
    },
  ],
};

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case UPDATE_STATUS:
      const index = action.payload.issueId;
      const newStatus = action.payload.newStatus;
      const newState = state.issues.slice();
      const issueToUpdate = newState.find((issue) => issue.id === index);

      if (issueToUpdate) {
        issueToUpdate.status = newStatus;
      }

      return {
        ...state,
        issues: newState,
      };
    case CREATE_ISSUE:
      const { title, description, assignee } = action.payload;

      const newIssue = {
        id: state.issues.length + 1,
        name: title,
        description,
        status: "New",
        assignee,
      };

      return {
        ...state,
        issues: [...state.issues, newIssue],
      };
    default:
      return state;
  }
};

export const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = Dispatch<UpdateStatus | CreateIssue>;
