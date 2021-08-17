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

interface CreateIssueState {
  title: string;
  description: string;
  open: boolean;
  charactersLeft: number;
  assignee: string;
  titleError: string | null;
  descriptionError: string | null;
  assigneeError: string | null;
  isSubmitting: boolean;
}

interface CreateIssueProps {
  issues: Array<IIssue>;
  users: Array<IUsers>
  dispatch: AppDispatch;
}

class CreateIssue extends Component<CreateIssueProps, CreateIssueState> {
  constructor(props: CreateIssueProps) {
    super(props);

    this.state = {
      title: "",
      description: "",
      open: false,
      charactersLeft: 255,
      assignee: "",
      titleError: "Please enter a title between 3 and 50 characters!",
      descriptionError:
        "Please enter a description between 3 and 255 characters!",
      assigneeError: "Please select an assignee",
      isSubmitting: false,
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
              fullWidth
              variant="outlined"
              margin="normal"
              name="Title"
              placeholder="Enter title..."
              required
              onChange={this.handleTitleChange}
              helperText={this.state.isSubmitting && this.state.titleError}
              error={this.state.isSubmitting && this.state.titleError !== null}
            />
            <div className="input-title">Description</div>
            <TextField
              fullWidth
              required
              variant="outlined"
              margin="normal"
              multiline
              minRows={6}
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
              onChange={this.handleDescriptionChange}
            />
            <div className="select-label">Assignee</div>
            <FormControl>
              <Select
                value={this.state.assignee}
                displayEmpty
                variant="outlined"
                onChange={this.handleAssigneeChange}
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

    if (titleError || descriptionError || assigneeError) {
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

    if (!title || title.length < 3 || title.length > 50) {
      this.setState({
        titleError: "Please enter a title between 3 and 50 characters!",
      });
    } else {
      this.setState({
        titleError: null,
      });
    }
  };

  handleDescriptionValidation = (): void => {
    const { description } = this.state;

    if (!description || description.length < 3 || description.length > 255) {
      this.setState({
        descriptionError:
          "Please enter a description between 3 and 255 characters!",
      });
    } else {
      this.setState({
        descriptionError: null,
      });
    }
  };

  handleAssigneeValidation = (): void => {
    const { assignee } = this.state;

    if (!assignee) {
      this.setState({
        assigneeError: "Please select an assignee",
      });
    } else {
      this.setState({
        assigneeError: null,
      });
    }
  };

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    this.setState({ title: value }, () => this.handleTitleValidation());
  };

  handleAssigneeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ): void => {
    const { value } = event.target;

    this.setState({ assignee: value as string }, () =>
      this.handleAssigneeValidation()
    );
  };

  handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;

    this.setState(
      { description: value, charactersLeft: 255 - value.length },
      () => this.handleDescriptionValidation()
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
