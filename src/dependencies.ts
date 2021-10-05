import { diTypes } from "dependencyTypes";
import { Container } from "inversify";
import { IWorkflowService } from "services/workflow/model";
import { WorkflowService } from "services/workflow/WorkflowService";

const container = new Container();
container
  .bind<IWorkflowService>(diTypes.IWorkflowService)
  .to(WorkflowService)
  .inSingletonScope();


export default container;