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
    const statusesInMap = transitions.values();
    const statusFieldTransitions: Array<Array<IStatus>> = [];

    for (let i = 0; i < transitions.size; i++) {
      statusFieldTransitions.push(statusesInMap.next().value);
    }

    return statusFieldTransitions;
  }

  parseTransitionsToStringArray(
    workflow?: IWorkflow
  ): Array<Array<string>> | undefined {
    if (!workflow) {
      return;
    }
    const transitionsAsString: Array<Array<string>> = [];
    const values = workflow.transitions.values();

    workflow.transitions.forEach((workflow) => {
      const transitionsArray = values
        .next()
        .value.map((status: IStatus) => status.name);

      transitionsAsString.push(transitionsArray);
    });

    return transitionsAsString;
  }

  checkForDeadEndStatuses(
    transitions: Array<Array<IStatus>>,
    statuses: Array<IStatus>,
    transitionsError: string | null
  ): boolean {
    let hasErrors = transitions.every((transition) => transition.length === 0);
    let hasDeadEndStatus = false;

    transitions.forEach((transition, index) => {
      const status = statuses[index];

      if (transition.length === 0) {
        transitions.forEach((transition) => {
          if (transition.includes(status)) {
            hasErrors = true;
          }
        });
      } else if (transitionsError || !hasDeadEndStatus) {
        const flattenedTransitions = transitions.flat();

        hasDeadEndStatus = !flattenedTransitions.some(
          (transitionStatus) => transitionStatus.id === status.id
        );
      }
    });

    if (hasErrors || hasDeadEndStatus) {
      return true;
    }

    return false;
  }
}
