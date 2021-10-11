import { diTypes } from "dependencyTypes";
import { Container } from "inversify";
import { IssueTypeService } from "services/issue-type/IssueTypeService";
import { IIssueTypeService } from "services/issue-type/model";
import { IWorkflowService } from "services/workflow/model";
import { WorkflowService } from "services/workflow/WorkflowService";

const container = new Container();
container
  .bind<IWorkflowService>(diTypes.IWorkflowService)
  .to(WorkflowService)
  .inSingletonScope();
container
  .bind<IIssueTypeService>(diTypes.IIssueTypeService)
  .to(IssueTypeService)
  .inSingletonScope();

export default container;
