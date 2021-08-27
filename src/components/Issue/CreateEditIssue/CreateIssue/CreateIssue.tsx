import CreateEditIssue from "components/Issue/CreateEditIssue/CreateEditIssue";
import { Component } from "react";
import { connect } from "react-redux";
import { createIssue } from "common/actions";
import { IIssue } from "common/models";
import { AppDispatch } from "store/store";

interface CreateIssueProps {
  dispatch: AppDispatch;
}

class CreateIssue extends Component<CreateIssueProps> {
  render() {
    return (
      <CreateEditIssue
        successAction={this.handleSubmit}
      />
    );
  }

  handleSubmit = (issue: IIssue): void => {
    const { title, description, assignee } = issue;
    this.props.dispatch(createIssue({ title, description, assignee }));
  };
}

export default connect()(CreateIssue);
