import { Component } from "react";
import { editIssue } from "common/actions";
import { IIssue } from "common/models";
import CreateEditIssue from "components/Issue/CreateEditIssue/CreateEditIssue";
import { AppDispatch } from "store/store";
import { connect } from "react-redux";

interface EditIssueProps {
  dispatch: AppDispatch;
  issue: IIssue;
}

class EditIssue extends Component<EditIssueProps> {
  render() {
    return (
      <CreateEditIssue
        issue={this.props.issue}
        successAction={this.handleSubmit}
        isEditing={true}
      ></CreateEditIssue>
    );
  }

  handleSubmit = (issue: IIssue): void => {
    const { id, title, description, assignee, status, type } = issue;
    this.props.dispatch(
      editIssue({ id, title, description, assignee, status, type })
    );
  };
}

export default connect()(EditIssue);
