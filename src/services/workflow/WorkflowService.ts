import { IIssue, IStatus, IType, IWorkflow, Transition } from "common/models";
import { injectable } from "inversify";
import { IWorkflowService } from "services/workflow/model";
import "reflect-metadata";

@injectable()
export class WorkflowService implements IWorkflowService {
  parseTransitionsToKeyValuePair(transitions: Transition): Array<string> {
    const pairs: Array<string> = [];
    transitions.forEach((value, key) => {
      const validStatuses = value.reduce(
        (acc, status, index) =>
          (acc += status.name + (index !== value.length - 1 ? ", " : "")),
        ""
      );
      pairs.push(key.name + ";" + validStatuses);
    });

    return pairs;
  }

  getAllValuesOfTransitionsMap(transitions: Transition): Array<Array<IStatus>> {
    return Array.from(transitions.values());
  }

  parseTransitionsToStringArray(workflow: IWorkflow): Array<Array<string>> {
    const transitionsAsString = Array.from(workflow.transitions.values()).map(
      (s) => s.map((status) => status.name)
    );

    return transitionsAsString;
  }

  checkForDeadEndStatuses(
    transitions: Array<Array<IStatus>>,
    statuses: Array<IStatus>
  ): Array<IStatus> | undefined {
    const isEmpty = transitions.every((transition) => transition.length === 0);
    const deadEndStatusesToReturn: Array<IStatus> = [];

    transitions.forEach((transition, index) => {
      const status = statuses[index];

      if (transition.length === 0) {
        transitions.forEach((transition) => {
          const deadEndStatus = transition.find((s) => s.id === status.id);
          if (deadEndStatus) {
            deadEndStatusesToReturn.push(deadEndStatus);
          }
        });
      } else if (deadEndStatusesToReturn.length === 0) {
        const flattenedTransitions = transitions.flat();

        const hasDeadEndStatus = !flattenedTransitions.find(
          (transitionStatus) => transitionStatus.id === status.id
        );

        if (hasDeadEndStatus) {
          deadEndStatusesToReturn.push(status);
        }
      }
    });

    if (isEmpty || deadEndStatusesToReturn.length > 0) {
      return deadEndStatusesToReturn;
    }

    return undefined;
  }

  checkForIssueTypeError(
    workflowName: string,
    transitions: Array<Array<IStatus>>,
    issues: Array<IIssue>,
    types: Array<IType>
  ): string | null {
    const flattenedTransitionsIds = transitions.flat().map(s => s.id);

    const allTypesLinkedToTheWorkflow = types
      .filter((type) => type.workflow === workflowName)
      .map((type) => type.name);

    const allIssuesLinkedToTheWorkflow = issues.filter((issue) =>
      allTypesLinkedToTheWorkflow.includes(issue.type)
    );
    const statusesIds = allIssuesLinkedToTheWorkflow.map((i) => i.status.id);

    const error = statusesIds.filter(id => !flattenedTransitionsIds.includes(id));
    const invalidStatuses: Array<string> = [];
    const set = new Set(error);
    set.forEach(id => {
      const status = issues.find(issue => issue.status.id === id)!.status.name;
      invalidStatuses.push(status);
    });

    if (error.length > 0) {
      return `Invalid transitions! There are issues of this type with statuses: ${invalidStatuses.toString()}`
    }

    return null;
  }

  checkForErrorOnDelete(
    workflowName: string,
    types: Array<IType>
  ): string | null {
    const error = types
      .filter((type) => type.workflow === workflowName)
      .map((t) => t.name);

    if (error.length > 0) {
      return `Can't delete workflow as it's currently assigned to the following types: ${error.toString()}`;
    }

    return null;
  }
}
