import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  IconButton,
  InputLabel,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "store/store";
import "components/Issue/CreateEditIssue/CreateEditIssue.css";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { IIssue, IUser } from "common/models";
import { issueConstants } from "common/constants";
import EditIcon from "@material-ui/icons/Edit";

interface CreateEditIssueState {
  open: boolean;
  title: string;
  description: string;
  assignee: string;
  status: string;
  charactersLeft: number;
  titleError: string | null;
  descriptionError: string | null;
  assigneeError: string | null;
}

interface CreateEditIssueProps {
  users: Array<IUser>;
  statuses: Array<string>;
  issue?: IIssue;
  successAction: (issue: IIssue) => void;
  isEditing?: boolean;
}

class CreateEditIssue extends Component<
  CreateEditIssueProps,
  CreateEditIssueState
> {
  constructor(props: CreateEditIssueProps) {
    super(props);

    this.state = {
      open: false,
      title: "",
      description: "",
      assignee: "",
      status: "NEW",
      charactersLeft: issueConstants.descriptionMaxChars,
      titleError: null,
      descriptionError: null,
      assigneeError: null,
    };
  }

  componentDidMount() {
    if (this.props.isEditing && this.props.issue) {
      const { title, description, assignee, status } = this.props.issue;
      this.setState({
        title,
        description,
        assignee,
        status,
        charactersLeft: issueConstants.descriptionMaxChars - description.length,
      });
    }
  }

  render(): JSX.Element {
    return (
      <div>
        {this.renderButton()}
        {this.renderDialog()}
      </div>
    );
  }

  renderButton(): JSX.Element {
    return (
      <>
        {this.props.isEditing ? (
          <IconButton
            color="primary"
            size="small"
            onClick={this.handleClickOpen}
          >
            <EditIcon fontSize="large" />
          </IconButton>
        ) : (
          <Button
            size="large"
            variant="contained"
            color="primary"
            startIcon={<AddBoxIcon />}
            onClick={this.handleClickOpen}
          >
            Create New Issue
          </Button>
        )}
      </>
    );
  }

  renderTitleField(): JSX.Element {
    const { title, titleError } = this.state;

    return (
      <>
        <InputLabel className="input-title" htmlFor="title" required>
          Title
        </InputLabel>
        <TextField
          onChange={this.handleTitleChange}
          defaultValue={title}
          fullWidth
          variant="outlined"
          margin="normal"
          id="title"
          placeholder="Enter title..."
          helperText={titleError}
          error={titleError !== null}
        />
      </>
    );
  }

  renderDescriptionField(): JSX.Element {
    const { description, descriptionError, charactersLeft } = this.state;

    return (
      <>
        <InputLabel className="input-title" htmlFor="description" required>
          Description
        </InputLabel>
        <TextField
          onChange={this.handleDescriptionChange}
          defaultValue={description}
          fullWidth
          multiline
          minRows={6}
          variant="outlined"
          margin="normal"
          id="description"
          placeholder="Enter description..."
          helperText={
            descriptionError
              ? descriptionError
              : `Max ${issueConstants.descriptionMaxChars} characters, ${charactersLeft} left`
          }
          error={descriptionError !== null}
        />
      </>
    );
  }

  renderAssigneeDropDown(): JSX.Element {
    const { assignee, assigneeError } = this.state;

    return (
      <>
        <InputLabel className="select-label" required>
          Assignee
        </InputLabel>
        <FormControl>
          <Select
            onChange={this.handleAssigneeChange}
            defaultValue={assignee}
            displayEmpty
            variant="outlined"
            value={assignee}
            error={assigneeError !== null}
          >
            <MenuItem value="">
              <em>--select assignee--</em>
            </MenuItem>
            {this.props.users.map((user) => (
              <MenuItem key={user.id} value={user.name}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={assigneeError !== null}>
            {assigneeError}
          </FormHelperText>
        </FormControl>
      </>
    );
  }

  renderStatusField(): JSX.Element {
    let { status } = this.state;
    status = status.toUpperCase()
    return (
      <>
        <InputLabel className="select-label">Status</InputLabel>
        <FormControl>
          <Select
            onChange={this.handleStatusChange}
            defaultValue={status}
            displayEmpty
            variant="outlined"
            value={status}
          >
            {this.props.statuses.map((status, index) => (
              <MenuItem key={index} value={status.toUpperCase()}>
                {status.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  }

  renderDialog(): JSX.Element {
    const { isEditing } = this.props;

    return (
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth>
          <DialogTitle classes={{ root: "dialog-title" }}>
            {isEditing ? "Edit Issue" : "Add New Issue"}
          </DialogTitle>
          <DialogContent>
            {this.renderTitleField()}
            {this.renderDescriptionField()}
            {this.renderAssigneeDropDown()}
            {isEditing && this.renderStatusField()}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
    );
  }

  handleSubmit = async (): Promise<void> => {
    const hasErrros = !this.handleValidation();
    if (hasErrros) {
      return;
    }

    const { title, description, assignee, status } = this.state;
    let id = 0;
    if (this.props.issue) {
      id = this.props.issue.id;
    }

    await this.props.successAction({
      id,
      title,
      description,
      assignee,
      status,
    });
    this.handleClose();
  };

  handleValidation = (): boolean => {
    const hasTtitleError = this.handleTitleValidation();
    const hasDescriptionError = this.handleDescriptionValidation();
    const hasAssigneeError = this.handleAssigneeValidation();

    if (hasTtitleError || hasDescriptionError || hasAssigneeError) {
      return false;
    }

    return true;
  };

  handleTitleValidation = (): boolean => {
    const { title } = this.state;
    const isNotValid = !title || title.length < 3 || title.length > 50;

    this.setState({
      titleError: isNotValid ? issueConstants.titleErrorMsg : null,
    });

    return isNotValid;
  };

  handleDescriptionValidation = (): boolean => {
    const { description } = this.state;
    const isNotValid =
      !description ||
      description.length < 3 ||
      description.length > issueConstants.descriptionMaxChars;

    this.setState({
      descriptionError: isNotValid ? issueConstants.descriptionErrorMsg : null,
    });

    return isNotValid;
  };

  handleAssigneeValidation = (): boolean => {
    const { assignee } = this.state;
    const isNotValid = !assignee;

    this.setState({
      assigneeError: isNotValid ? issueConstants.assigneeErrorMsg : null,
    });

    return isNotValid;
  };

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    this.setState({ title: value, titleError: null });
  };

  handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;

    this.setState({
      description: value,
      charactersLeft: issueConstants.descriptionMaxChars - value.length,
      descriptionError: null,
    });
  };

  handleAssigneeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    const { value } = event.target;

    this.setState({ assignee: value as string, assigneeError: null });
  };

  handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const { value } = event.target;

    this.setState({ status: value as string });
  };

  handleClose = (): void => {
    if (this.props.isEditing) {
      this.handleCloseEditIssueDialog();
    } else {
      this.handleCloseCreateIssueDialog();
    }
  };

  handleCloseCreateIssueDialog = (): void => {
    const stateAfterDialogClose = {
      open: false,
      titleError: null,
      descriptionError: null,
      assigneeError: null,
      charactersLeft: issueConstants.descriptionMaxChars,
      title: "",
      description: "",
      assignee: "",
    };

    this.setState(stateAfterDialogClose);
  };

  handleCloseEditIssueDialog = (): void => {
    const { title, description, assignee, status } = this.props.issue!;

    const stateAfterDialogClose = {
      open: false,
      titleError: null,
      descriptionError: null,
      assigneeError: null,
      charactersLeft: issueConstants.descriptionMaxChars - description.length,
      title,
      description,
      assignee,
      status,
    };

    this.setState(stateAfterDialogClose);
  };

  handleClickOpen = (): void => {
    this.setState({
      open: true,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  users: state.users,
  statuses: state.statuses,
});

export default connect(mapStateToProps)(CreateEditIssue);
