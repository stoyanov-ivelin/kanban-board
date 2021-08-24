import { createReducer, createStore } from "@reduxjs/toolkit";
import { UPDATE_STATUS, CREATE_ISSUE, EDIT_ISSUE } from "common/actions";
import { Status } from "common/constants";
import { CreateIssue, EditIssue, UpdateStatus } from "common/models";

const initialState = {
  issues: [
    {
      id: 0,
      title: "Learn Redux",
      description: "Read the official docs of Redux",
      status: Status.New,
      assignee: "Ivan Ivanov",
    },
    {
      id: 1,
      title: "Setup project",
      description: "An empty React project with TS and Redux",
      status: Status.New,
      assignee: "Rumen Stoychev",
    },
    {
      id: 2,
      title: "Implement Trello Board",
      description: "A Kanban board with drag-and-drop feature",
      status: Status.New,
      assignee: "Alex Petrov",
    },
    {
      id: 3,
      title: "Submit code for review",
      description: "Open a new pull request",
      status: Status.New,
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
      skills: ["Java", "Scala", "JavaScript", "C#"],
    },
    {
      id: 0,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Rumen Stoychev",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: ["GoLang", "C#", "Scala", "JavaScript"],
    },
    {
      id: 0,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Alex Petrov",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: ["Java", "C#", "Scala"],
    },
    {
      id: 0,
      profilePicture:
        "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
      name: "Deyan Dimitrov",
      jobPosition: "Software Developer",
      description:
        "An experienced software engineer with over seven years of experience in the industry. Currently working on a mobile app development project.",
      skills: ["JavaScript", "C#", "GoLang", "Scala", "Java"],
    },
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
      const newIssue = {
        id: state.issues.length + 1,
        title,
        description,
        status: Status.New,
        assignee,
      };

      state.issues.push(newIssue);
    })
    .addCase(EDIT_ISSUE, (state: RootState, action: EditIssue) => {
      const { id, title, description, assignee, status } = action.payload;
      const issueToEdit = state.issues.find(issue => issue.id === id);

      if (issueToEdit) {
        issueToEdit.title = title;
        issueToEdit.description = description;
        issueToEdit.assignee = assignee;
        issueToEdit.status = status;
      }
      
    })
    .addDefaultCase((state, action) => {});
});

export const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
