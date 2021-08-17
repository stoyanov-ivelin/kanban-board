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
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { AppDispatch, RootState } from "store/store";
import "./CreateIssue.css";
import { createIssue } from "common/actions";
import { IIssue, IUsers } from "common/models";
import { createIssueConstants } from "common/constants";

interface CreateIssueState {
  open: boolean;
  isSubmitting: boolean;
  title: string;
  description: string;
  assignee: string;
  charactersLeft: number;
  titleError: string | null;
  descriptionError: string | null;
  assigneeError: string | null;
}

interface CreateIssueProps {
  issues: Array<IIssue>;
  users: Array<IUsers>;
  dispatch: AppDispatch;
}

class CreateIssue extends Component<CreateIssueProps, CreateIssueState> {
  constructor(props: CreateIssueProps) {
    super(props);

    this.state = {
      open: false,
      isSubmitting: false,
      title: "",
      description: "",
      assignee: "",
      charactersLeft: createIssueConstants.descriptionMaxChars,
      titleError: createIssueConstants.titleErrorMsg,
      descriptionError: createIssueConstants.descriptionErrorMsg,
      assigneeError: createIssueConstants.assigneeErrorMsg,
    };
  }

  render(): JSX.Element {
    return (
      <div>
        <Button
          size="large"
          variant="contained"
          color="primary"
          startIcon={<AddBoxIcon />}
          onClick={this.handleClickOpen}
        >
          Create New Issue
        </Button>

        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth>
          <DialogTitle classes={{ root: "dialog-title" }}>
            Add new issue
          </DialogTitle>
          <DialogContent>
            <div className="input-title">Title</div>
            <TextField
              onChange={this.handleTitleChange}
              fullWidth
              variant="outlined"
              margin="normal"
              name="Title"
              placeholder="Enter title..."
              helperText={this.state.isSubmitting && this.state.titleError}
              error={this.state.isSubmitting && this.state.titleError !== null}
            />
            <div className="input-title">Description</div>
            <TextField
              onChange={this.handleDescriptionChange}
              fullWidth
              multiline
              minRows={6}
              variant="outlined"
              margin="normal"
              name="name"
              placeholder="Enter description..."
              helperText={
                this.state.isSubmitting && this.state.descriptionError
                  ? this.state.descriptionError
                  : `Max 255 characters, ${this.state.charactersLeft} left`
              }
              error={
                this.state.isSubmitting && this.state.descriptionError !== null
              }
            />
            <div className="select-label">Assignee</div>
            <FormControl>
              <Select
                onChange={this.handleAssigneeChange}
                displayEmpty
                variant="outlined"
                value={this.state.assignee}
                error={
                  this.state.isSubmitting && this.state.assigneeError !== null
                }
              >
                <MenuItem value="">
                  <em>--select assignee--</em>
                </MenuItem>
                {this.props.users.map((user) => (
                  <MenuItem value={user.name}>{user.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText
                error={
                  this.state.isSubmitting && this.state.assigneeError !== null
                }
              >
                {this.state.isSubmitting && this.state.assigneeError}
              </FormHelperText>
            </FormControl>
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

    const { title, description, assignee } = this.state;
    this.props.dispatch(createIssue({ title, description, assignee }));

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
      titleError: isValid ? createIssueConstants.titleErrorMsg : null,
    });
  };

  handleDescriptionValidation = (): void => {
    const { description } = this.state;
    const isValid =
      !description ||
      description.length < 3 ||
      description.length > createIssueConstants.descriptionMaxChars;

    this.setState({
      descriptionError: isValid
        ? createIssueConstants.descriptionErrorMsg
        : null,
    });
  };

  handleAssigneeValidation = (): void => {
    const { assignee } = this.state;
    const isValid = !assignee;

    this.setState({
      assigneeError: isValid ? createIssueConstants.assigneeErrorMsg : null,
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
        charactersLeft: createIssueConstants.descriptionMaxChars - value.length,
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

  handleClose = () => {
    this.setState({
      open: false,
      isSubmitting: false,
      titleError: null,
      descriptionError: null,
      charactersLeft: 255,
      title: "",
      description: "",
      assignee: "",
    });
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
  users: state.users,
});

export default connect(mapStateToProps)(CreateIssue);
