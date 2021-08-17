import { Action } from "@reduxjs/toolkit";

export interface IIssue {
  id: number;
  name: string;
  description: string;
  status: string;
  assignee: string;
}

export interface IUsers {
  id: number;
  profilePicture: string;
  name: string;
  jobPosition: string;
  description: string;
  skills: Array<string>;
}

export interface UpdateStatusPayload {
  newStatus: string;
  issueId: number;
}

export interface CreateIssuePayload {
  title: string;
  description: string;
  assignee: string;
}

export interface UpdateStatus extends Action {
  payload: UpdateStatusPayload;
}

export interface CreateIssue extends Action {
  payload: CreateIssuePayload;
}
