import CreateEditIssue from "components/Issue/CreateEditIssue/CreateEditIssue";
import { Component } from "react";
import { connect } from "react-redux";
import { createIssue } from "common/actions";
import { IIssue } from "common/models";
import { AppDispatch } from "store/store";
import { issueConstants } from "common/constants";

interface ICloseCreateIssueDialog {
  open: boolean;
  isSubmitting: boolean;
  titleError: null;
  descriptionError: null;
  charactersLeft: number;
  title: string;
  description: string;
  assignee: string;
}

interface CreateIssueProps {
  dispatch: AppDispatch;
}

class CreateIssue extends Component<CreateIssueProps> {
  render() {
    return (
      <CreateEditIssue
        successAction={this.handleSubmit}
        cancelAction={this.handleClose}
      />
    );
  }

  handleSubmit = (issue: IIssue): void => {
    const { title, description, assignee } = issue;
    this.props.dispatch(createIssue({ title, description, assignee }));
  };

  handleClose = (): ICloseCreateIssueDialog => {
    return {
      open: false,
      isSubmitting: false,
      titleError: null,
      descriptionError: null,
      charactersLeft: issueConstants.descriptionMaxChars,
      title: "",
      description: "",
      assignee: "",
    };
  };
}

export default connect()(CreateIssue);
