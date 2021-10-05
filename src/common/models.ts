import { Action } from "@reduxjs/toolkit";

export type Transition = Map<IStatus, Array<IStatus>>;

export interface ISkill {
  name: string;
  img: string;
}

export interface IStatus {
  id: number;
  name: string;
}

export interface IIssue {
  id: number;
  title: string;
  description: string;
  status: IStatus;
  assignee: string;
}

export interface IColumn {
  name: string;
  statuses: Array<IStatus>;
}

export interface IBoard {
  name: string;
  columns: Array<IColumn>;
}

export interface IUser {
  id: number;
  profilePicture: string;
  name: string;
  jobPosition: string;
  description: string;
  skills: Array<ISkill>;
}

export interface IWorkflow {
  name: string;
  transitions: Transition
}


export interface UpdateStatusPayload {
  newStatus: IStatus;
  issueId: number;
}

export interface UpdateStatus extends Action {
  payload: UpdateStatusPayload;
}

export interface CreateEditIssuePayload {
  title: string;
  description: string;
  assignee: string;
}

export interface CreateIssuePayload extends CreateEditIssuePayload {}

export interface EditIssuePayload extends CreateEditIssuePayload {
  id: number;
  status: IStatus;
}

export interface CreateIssue extends Action {
  payload: CreateIssuePayload;
}

export interface EditIssue extends Action {
  payload: EditIssuePayload;
}

export interface CreateEditUserPayload {
  profilePicture: string;
  jobPosition: string;
  name: string;
  description: string;
  skills: Array<ISkill>;
}

export interface CreateUserPayload extends CreateEditUserPayload {}

export interface EditUserPayload extends CreateEditUserPayload {
  id: number;
}

export interface CreateUser extends Action {
  payload: CreateUserPayload;
}

export interface EditUser extends Action {
  payload: EditUserPayload;
}

export type CreateStatusPayload = string;

export type DeleteStatusPayload = number;

export interface CreateStatus extends Action {
  payload: CreateStatusPayload;
}

export interface DeleteStatus extends Action {
  payload: DeleteStatusPayload;
}

export interface RenameColumnPayload {
  name: string;
  boardIndex: number;
  columnIndex: number;
}

export interface RenameColumn extends Action {
  payload: RenameColumnPayload;
}

export interface MoveColumnPayload {
  boardIndex: number;
  columnIndex: number;
  to: string;
}

export interface MoveColumn extends Action {
  payload: MoveColumnPayload;
}

export interface DeleteColumnPayload {
  boardIndex: number;
  columnIndex: number;
}

export interface DeleteColumn extends Action {
  payload: DeleteColumnPayload;
}

export interface AddColumnPayload {
  boardIndex: number;
}

export interface AddColumn extends Action {
  payload: AddColumnPayload;
}

export interface AddBoardPayload {
  name: string;
}

export interface AddBoard extends Action {
  payload: AddBoardPayload;
}

export interface AddStatusToColumnPayload {
  prevColumnIndex: number;
  boardIndex: number;
  columnIndex: number;
  statusId: number;
}

export interface AddStatusToColumn extends Action {
  payload: AddStatusToColumnPayload;
}

export interface AddStatusToUnusedStatusesPayload {
  boardIndex: number;
  columnIndex: number;
  statusId: number;
}

export interface AddStatusToUnusedStatuses extends Action {
  payload: AddStatusToUnusedStatusesPayload;
}

export interface CreateWorkflowPayload {
  name: string;
  transitions: Array<Array<IStatus>>;
}

export interface CreateWorkflow extends Action {
  payload: CreateWorkflowPayload;
}

export interface EditWorkflowPayload {
  index: number;
  name: string;
  transitions: Array<Array<IStatus>>;
}

export interface EditWorkflow extends Action {
  payload: EditWorkflowPayload;
}

export interface DeleteWorkflowPayload {
  name: string;
}

export interface DeleteWorkflow extends Action {
  payload: DeleteWorkflowPayload;
}

