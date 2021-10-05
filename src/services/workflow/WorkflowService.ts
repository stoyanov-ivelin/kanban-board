import { IStatus, IWorkflow, Transition } from "common/models";
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
}
