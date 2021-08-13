export interface IIssue {
  id: number;
  name: string;
  description: string;
  status: string;
  assignee: string;
}

export interface UpdateStatusPaylod {
  newStatus: string;
  issueId: number;
}

export interface UpdateStatus {
  type: string;
  payload: UpdateStatusPaylod;
}
