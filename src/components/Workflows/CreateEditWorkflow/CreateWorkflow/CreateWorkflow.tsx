import { createWorkflow } from "common/actions";
import { IStatus } from "common/models";
import CreateEditWorkflow from "components/Workflows/CreateEditWorkflow/CreateEditWorkflow";
import { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch } from "store/store";

interface CreateWorkflowProps {
  dispatch: AppDispatch;
}

class CreateWorkflow extends Component<CreateWorkflowProps> {
  render() {
    return (
      <CreateEditWorkflow
        successAction={this.handleSubmit}
      />
    );
  }

  handleSubmit = async (
    name: string,
    transitions: Array<IStatus[]>
  ): Promise<void> => {
    this.props.dispatch(createWorkflow({ name, transitions }));
  };
}

export default connect()(CreateWorkflow);
