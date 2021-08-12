export interface IIssue {
  id: number;
  name: string;
  description: string;
  status: string;
  assignee: string;
}

export type UpdateStatusPaylod = {
  newStatus: string;
  issueId: number;
};

export type UpdateStatus = { type: string; payload: UpdateStatusPaylod };
