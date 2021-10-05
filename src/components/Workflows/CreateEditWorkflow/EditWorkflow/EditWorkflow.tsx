import { editWorkflow } from "common/actions";
import { IStatus, IWorkflow } from "common/models";
import CreateEditWorkflow from "components/Workflows/CreateEditWorkflow/CreateEditWorkflow";
import { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch } from "store/store";

interface EditWorkflowProps {
  dispatch: AppDispatch;
  workflow: IWorkflow;
  index: number;
  transitions:Array<Array<IStatus>>;
}

class EditWorkflow extends Component<EditWorkflowProps> {
  render() {

    return (
      <CreateEditWorkflow
        isEditing={true}
        workflow={this.props.workflow}
        transitions={this.props.transitions}
        successAction={this.handleSubmit}
      />
    );
  }

  handleSubmit = async (
    name: string,
    transitions: Array<IStatus[]>,
    index: number | undefined = this.props.index
  ): Promise<void> => {
    this.props.dispatch(editWorkflow({ index: index!, name, transitions }));
  };
}

export default connect()(EditWorkflow);
