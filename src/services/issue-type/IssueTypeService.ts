import { injectable } from "inversify";
import { IIssueTypeService } from "services/issue-type/model";
import { IIssue, IType, IWorkflow } from "common/models";
import "reflect-metadata";

const nameError = "Please enter a name between 3 and 50 characters!";
const alreadyExistsErorr = "This type already exists!";

@injectable()
export class IssueTypeService implements IIssueTypeService {
  checkForErrorOnAdd(name: string, types: Array<IType>): string | null {
    if (!name || name.length < 3 || name.length > 50) {
      return nameError;
    }

    const typesNames = types.map((type) => type.name);
    if (typesNames.includes(name)) {
      return alreadyExistsErorr;
    }

    return null;
  }

  checkForErrorOnEdit(
    typeIndex: number,
    name: string,
    workflow: string,
    types: Array<IType>,
    issues: Array<IIssue>,
    workflows: Array<IWorkflow>
  ): string | null {
    if (!name || name.length < 3 || name.length > 50) {
      return nameError;
    }

    const type = types[typeIndex];
    const typesNames = types.map((type) => type.name);
    const isNotSameName = name !== type.name;
    if (isNotSameName && typesNames.includes(name)) {
      return alreadyExistsErorr;
    }

    const statusesIdsOfIssuesWithThisType = issues
      .filter((issue) => issue.type === type.name)
      .map((issue) => issue.status.id);

    const newWorkflow = workflows.find((w) => w.name === workflow)!;
    const statusesIdsOfNewTransitions = Array.from(
      newWorkflow.transitions.values()
    )
      .flat()
      .map((s) => s.id);

    const hasIssueStatusError = !statusesIdsOfIssuesWithThisType.every((id) =>
      statusesIdsOfNewTransitions.includes(id)
    );

    if (hasIssueStatusError) {
      return `Can't assign workflow: ${workflow} to this type as there are issues of this type with a status that's not utilized by this workflow.`;
    }

    return null;
  }

  checkForErrorOnDelete(name: string, issues: Array<IIssue>): string | null {
    const issueTypes = issues.map((issue) => issue.type);

    if (issueTypes.includes(name)) {
      return "Can't delete type as it's currently assigned to one or more issues!";
    }

    return null;
  }
}
