import { IIssue, IType, IWorkflow } from "common/models";

export interface IIssueTypeService {
  checkForErrorOnAdd(name: string, types: Array<IType>): string | null;
  checkForErrorOnEdit(typeIndex: number, name: string, workflow: string, types: Array<IType>, issues: Array<IIssue>, workflows: Array<IWorkflow>): string | null;
  checkForErrorOnDelete(name: string, issues: Array<IIssue>): string | null;
}
