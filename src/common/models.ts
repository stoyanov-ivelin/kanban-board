import { Action } from "@reduxjs/toolkit";
import { Status } from "common/constants";

export interface ISkill {
  name: string;
  img: string;
}

export interface IIssue {
  id: number;
  title: string;
  description: string;
  status: Status;
  assignee: string;
}

export interface IUser {
  id: number;
  profilePicture: string;
  name: string;
  jobPosition: string;
  description: string;
  skills: Array<ISkill>;
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
