import { Component } from "react";
import { editIssue } from "common/actions";
import { IIssue } from "common/models";
import { issueConstants, Status } from "common/constants";
import CreateEditIssue from "components/Issue/CreateEditIssue/CreateEditIssue";
import { AppDispatch } from "store/store";
import { connect } from "react-redux";

interface EditIssueProps {
  dispatch: AppDispatch;
  issue: IIssue;
}

interface ICloseEditIssueDialog {
  open: boolean;
  isSubmitting: boolean;
  titleError: null;
  descriptionError: null;
  charactersLeft: number;
  title: string;
  description: string;
  assignee: string;
  status: string;
}

class EditIssue extends Component<EditIssueProps> {
  render() {
    return (
      <CreateEditIssue
        issue={this.props.issue}
        successAction={this.handleSubmit}
        cancelAction={this.handleClose}
        isEditing={true}
      ></CreateEditIssue>
    );
  }

  handleSubmit = (issue: IIssue): void => {
    const { id, title, description, assignee, status } = issue;
    this.props.dispatch(
      editIssue({ id, title, description, assignee, status: status as Status })
    );
  };

  handleClose = (
    title: string,
    description: string,
    assignee: string,
    status: string
  ): ICloseEditIssueDialog => {
    return {
      open: false,
      isSubmitting: false,
      titleError: null,
      descriptionError: null,
      charactersLeft: issueConstants.descriptionMaxChars - description.length,
      title,
      description,
      assignee,
      status,
    };
  };
}

export default connect()(EditIssue);
