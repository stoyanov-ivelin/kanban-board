export interface IIssue {
  id: number;
  name: string;
  description: string;
  status: string;
  assignee: string;
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

export interface UpdateStatus {
  type: string;
  payload: UpdateStatusPayload;
}
