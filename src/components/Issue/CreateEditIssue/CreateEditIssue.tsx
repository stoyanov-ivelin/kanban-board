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
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "store/store";
import "components/Issue/CreateEditIssue/CreateEditIssue.css";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { IIssue, IUsers } from "common/models";
import { issueConstants, Status } from "common/constants";
import EditIcon from "@material-ui/icons/Edit";

interface CreateEditIssueState {
  open: boolean;
  isSubmitting: boolean;
  title: string;
  description: string;
  assignee: string;
  status?: Status;
  charactersLeft: number;
  titleError: string | null;
  descriptionError: string | null;
  assigneeError: string | null;
}

interface CreateEditIssueProps {
  users: Array<IUsers>;
  issue?: IIssue;
  successAction: (issue: IIssue) => void;
  cancelAction: any;
  isEditing?: boolean;
}

class CreateEditIssue extends Component<
  CreateEditIssueProps,
  CreateEditIssueState
> {
  constructor(props: CreateEditIssueProps) {
    super(props);

    const { isEditing } = this.props;
    this.state = {
      open: false,
      isSubmitting: false,
      title: "",
      description: "",
      assignee: "",
      status: Status.New,
      charactersLeft: issueConstants.descriptionMaxChars,
      titleError: isEditing ? null : issueConstants.titleErrorMsg,
      descriptionError: isEditing ? null : issueConstants.descriptionErrorMsg,
      assigneeError: isEditing ? null : issueConstants.assigneeErrorMsg,
    };
  }

  componentDidMount() {
    if (this.props.isEditing && this.props.issue) {
      const { title, description, assignee, status } = this.props.issue;
      this.setState({
        title,
        description,
        assignee,
        status: status as Status,
        charactersLeft: issueConstants.descriptionMaxChars - description.length,
      });
    }
  }

  render(): JSX.Element {
    const {
      open,
      isSubmitting,
      title,
      description,
      assignee,
      status,
      charactersLeft,
      titleError,
      descriptionError,
      assigneeError,
    } = this.state;

    const { isEditing } = this.props;

    return (
      <div>
        {isEditing ? (
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
        <Dialog open={open} onClose={this.handleClose} fullWidth>
          <DialogTitle classes={{ root: "dialog-title" }}>
            {isEditing ? "Edit Issue" : "Add New Issue"}
          </DialogTitle>
          <DialogContent>
            <div className="input-title">Title</div>
            <TextField
              onChange={this.handleTitleChange}
              defaultValue={title}
              fullWidth
              variant="outlined"
              margin="normal"
              name="Title"
              placeholder="Enter title..."
              helperText={isSubmitting && titleError}
              error={isSubmitting && titleError !== null}
            />
            <div className="input-title">Description</div>
            <TextField
              onChange={this.handleDescriptionChange}
              defaultValue={description}
              fullWidth
              multiline
              minRows={6}
              variant="outlined"
              margin="normal"
              name="name"
              placeholder="Enter description..."
              helperText={
                isSubmitting && descriptionError
                  ? descriptionError
                  : `Max ${issueConstants.descriptionMaxChars} characters, ${charactersLeft} left`
              }
              error={isSubmitting && descriptionError !== null}
            />
            <div className="select-label">Assignee</div>
            <FormControl>
              <Select
                onChange={this.handleAssigneeChange}
                defaultValue={assignee}
                displayEmpty
                variant="outlined"
                value={assignee}
                error={isSubmitting && assigneeError !== null}
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
              <FormHelperText error={isSubmitting && assigneeError !== null}>
                {isSubmitting && assigneeError}
              </FormHelperText>
            </FormControl>
            {isEditing && (
              <div>
                <div className="select-label">Status</div>
                <FormControl>
                  <Select
                    onChange={this.handleStatusChange}
                    defaultValue={status}
                    displayEmpty
                    variant="outlined"
                    value={status}
                  >
                    {Object.values(Status).map((status, index) => (
                      <MenuItem key={index} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
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
      </div>
    );
  }

  handleSubmit = (): void => {
    const { titleError, descriptionError, assigneeError } = this.state;

    this.setState(
      {
        isSubmitting: true,
      },
      () => this.handleValidation()
    );

    const hasErrros = titleError || descriptionError || assigneeError;
    if (hasErrros) {
      return;
    }

    const { title, description, assignee, status } = this.state;
    let id = 0;
    if (this.props.issue) {
      id = this.props.issue.id;
    }

    this.props.successAction({
      id,
      title,
      description,
      assignee,
      status: status as string,
    });
    this.handleClose();
  };

  handleValidation = (): void => {
    this.handleTitleValidation();
    this.handleDescriptionValidation();
    this.handleAssigneeValidation();
  };

  handleTitleValidation = (): void => {
    const { title } = this.state;
    const isValid = !title || title.length < 3 || title.length > 50;

    this.setState({
      titleError: isValid ? issueConstants.titleErrorMsg : null,
    });
  };

  handleDescriptionValidation = (): void => {
    const { description } = this.state;
    const isValid =
      !description ||
      description.length < 3 ||
      description.length > issueConstants.descriptionMaxChars;

    this.setState({
      descriptionError: isValid ? issueConstants.descriptionErrorMsg : null,
    });
  };

  handleAssigneeValidation = (): void => {
    const { assignee } = this.state;
    const isValid = !assignee;

    this.setState({
      assigneeError: isValid ? issueConstants.assigneeErrorMsg : null,
    });
  };

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    this.setState({ title: value }, () => this.handleTitleValidation());
  };

  handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;

    this.setState(
      {
        description: value,
        charactersLeft: issueConstants.descriptionMaxChars - value.length,
      },
      () => this.handleDescriptionValidation()
    );
  };

  handleAssigneeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    const { value } = event.target;

    this.setState({ assignee: value as string }, () =>
      this.handleAssigneeValidation()
    );
  };

  handleStatusChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ): void => {
    const { value } = event.target;

    this.setState({ status: value as Status });
  };

  handleClose = (): void => {
    const { title, description, assignee, status } = this.state;

    if (this.props.isEditing) {
      const stateAfterDialogClose = this.props.cancelAction(
        title,
        description,
        assignee,
        status
      );
      this.setState(stateAfterDialogClose);
    } else {
      const stateAfterDialogClose = this.props.cancelAction();
      this.setState(stateAfterDialogClose);
    }
  };

  handleClickOpen = (): void => {
    this.setState({
      open: true,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
  users: state.users,
});

export default connect(mapStateToProps)(CreateEditIssue);
