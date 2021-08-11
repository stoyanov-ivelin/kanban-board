export interface IIssue {
  id: number;
  name: string;
  description: string;
  status: string;
  assignee: string;
}

export type DragBegin = {type: string, payload: number};
export type UpdateStatus =  {type: string, payload: string};