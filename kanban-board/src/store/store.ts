import { AnyAction, createStore, Dispatch } from "@reduxjs/toolkit";
import { DRAG_BEGIN, UPDATE_STATUS } from "../common/actions";
import { DragBegin, UpdateStatus } from "../common/types";

const initialState = {
  issues: [
    {id: 0, name: 'Learn Redux', description: 'Read the official docs of Redux', status: 'New', assignee: 'Assignee Name'},
    {id: 1, name: 'Setup project', description: 'An empty React project with TS and Redux', status: 'New', assignee: 'Assignee Name'},
    {id: 2, name: 'Implement Trello Board', description: 'A Kanban board with drag-and-drop feature', status: 'New', assignee: 'Assignee Name'},
    {id: 3 , name: 'Submit code for review', description: 'Open a new pull request', status: 'New', assignee: 'Assignee Name'},
  ],
  currentDraggedElement: 0
}

const reducer = (state = initialState, action: AnyAction) => {
  switch(action.type) {
    case DRAG_BEGIN:
      return {
        ...state,
        currentDraggedElement: action.payload
      }
    case UPDATE_STATUS:
      const index = state.currentDraggedElement;
      const newState = { ...state, currentDraggedElement: null };
      const newStatus = action.payload;
      newState.issues[index].status = newStatus;

      return newState;
    default:
      return state;
  }
}

export const store = createStore(reducer);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = Dispatch<DragBegin | UpdateStatus>
