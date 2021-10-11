import { IIssue, IStatus, IType, IWorkflow, Transition } from "common/models";

export interface IWorkflowService {
  parseTransitionsToKeyValuePair(transitions: Transition): Array<string>;
  getAllValuesOfTransitionsMap(transitions: Transition): Array<Array<IStatus>>;
  parseTransitionsToStringArray(workflow: IWorkflow): Array<Array<string>>;
  checkForDeadEndStatuses(transitions: Array<Array<IStatus>>, statuses: Array<IStatus>, transitionsError: string | null): Array<IStatus> | undefined;
  checkForErrorOnDelete(workflowName: string, types: Array<IType>): string | null;
  checkForIssueTypeError(workflowName: string, transitions: Array<Array<IStatus>>, issues: Array<IIssue>, types: Array<IType>): string | null
}