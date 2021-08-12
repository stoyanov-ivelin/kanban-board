import { AnyAction, createStore, Dispatch } from "@reduxjs/toolkit";
import { UPDATE_STATUS } from "../common/actions";
import { UpdateStatus } from "../common/models";

const initialState = {
  issues: [
    {id: 0, name: 'Learn Redux', description: 'Read the official docs of Redux', status: 'New', assignee: 'Assignee Name'},
    {id: 1, name: 'Setup project', description: 'An empty React project with TS and Redux', status: 'New', assignee: 'Assignee Name'},
    {id: 2, name: 'Implement Trello Board', description: 'A Kanban board with drag-and-drop feature', status: 'New', assignee: 'Assignee Name'},
    {id: 3 , name: 'Submit code for review', description: 'Open a new pull request', status: 'New', assignee: 'Assignee Name'},
  ],
}

const reducer = (state = initialState, action: AnyAction) => {
  switch(action.type) {
    case UPDATE_STATUS:
      const index = action.payload.issueId;
      const newStatus = action.payload.newStatus;
      const newState = state.issues.map(issue => {
        if (issue.id === index) {
          issue.status = newStatus;
        }

        return issue;
      });

      return {
        issues: newState
      };
    default:
      return state;
  }
}

export const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = Dispatch<UpdateStatus>