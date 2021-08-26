import { Action } from "@reduxjs/toolkit";
import { Status } from "common/constants";

export interface IIssue {
  id: number;
  title: string;
  description: string;
  status: string;
  assignee: string;
}

export interface IUser {
  id: number;
  profilePicture: string;
  name: string;
  jobPosition: string;
  description: string;
  skills: Array<string>;
}

export interface UpdateStatusPayload {
  newStatus: Status;
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
  status: Status;
}

export interface CreateIssue extends Action {
  payload: CreateIssuePayload;
}

export interface EditIssue extends Action {
  payload: EditIssuePayload;
}

export interface CreateEditUserPayload {
  profilePicture: string;
  name: string;
  description: string;
  skills: Array<string>;
}

export interface CreateUserPayload extends CreateEditUserPayload {}

export interface CreateUser extends Action {
  payload: CreateUserPayload;
}
