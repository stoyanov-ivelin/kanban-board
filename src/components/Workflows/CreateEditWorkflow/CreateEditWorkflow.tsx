import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import "components/Issue/CreateEditIssue/CreateEditIssue.css";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { IIssue, IStatus, IType, IWorkflow } from "common/models";
import EditIcon from "@material-ui/icons/Edit";
import InputLabel from "@mui/material/InputLabel";
import SelectStatusField from "components/Workflows/SelectTransitionsStatusField/SelectTransitionsStatusField";
import { resolve } from "inversify-react";
import { diTypes } from "dependencyTypes";
import { IWorkflowService } from "services/workflow/model";

interface CreateEditWorkflowState {
  open: boolean;
  name: string;
  nameForValidation: string;
  nameError: string | null;
  transitions: Array<Array<IStatus>>;
  transitionsError: string | null;
}

interface CreateEditWorkflowProps {
  issues: Array<IIssue>;
  statuses: Array<IStatus>;
  types: Array<IType>;
  workflows: Array<IWorkflow>;
  workflow?: IWorkflow;
  transitions?: Array<Array<IStatus>>;
  dispatch: AppDispatch;
  isEditing?: boolean;
  successAction: (
    name: string,
    transitions: Array<IStatus[]>,
    index?: number
  ) => Promise<void>;
}

class CreateEditWorkflow extends Component<
  CreateEditWorkflowProps,
  CreateEditWorkflowState
> {
  @resolve(diTypes.IWorkflowService) private workflowService: IWorkflowService;

  constructor(props: CreateEditWorkflowProps) {
    super(props);
    const { statuses } = this.props;

    this.state = {
      open: false,
      name: "",
      nameForValidation: "",
      nameError: null,
      transitions: Array.from(Array(statuses.length), () => []),
      transitionsError: null,
    };
  }

  componentDidMount() {
    const { isEditing, workflow, transitions } = this.props;

    if (isEditing && workflow && transitions) {
      this.setState({
        name: workflow.name,
        nameForValidation: workflow.name,
        transitions,
      });
    }
  }

  render(): JSX.Element {
    return (
      <>
        {this.renderButton()}
        {this.renderDialog()}
      </>
    );
  }

  renderButton(): JSX.Element {
    return (
      <>
        {this.props.isEditing ? (
          <Button
            color="primary"
            size="large"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={this.handleOpen}
          >
            Edit Workflow
          </Button>
        ) : (
          <Button
            size="large"
            variant="contained"
            color="primary"
            startIcon={<AddBoxIcon />}
            onClick={this.handleOpen}
          >
            Create New Workflow
          </Button>
        )}
      </>
    );
  }

  renderNameField(): JSX.Element {
    const { name, nameError } = this.state;

    return (
      <>
        <InputLabel className="input-title" htmlFor="title" required>
          Name
        </InputLabel>
        <TextField
          onChange={this.handleNameChange}
          defaultValue={name}
          fullWidth
          variant="outlined"
          margin="normal"
          id="title"
          placeholder="Enter a workflow name..."
          helperText={nameError}
          error={nameError !== null}
        />
      </>
    );
  }

  renderTransitions(): JSX.Element {
    const { statuses, workflow } = this.props;
    const { transitionsError } = this.state;

    return (
      <>
        <Typography variant="h6">Transitions *</Typography>
        {statuses.map((status, index) => {
          let transitionsAsString = undefined;

          if (workflow) {
            transitionsAsString =
              this.workflowService.parseTransitionsToStringArray(workflow);
          }

          return (
            <SelectStatusField
              key={status.id}
              transitions={transitionsAsString && transitionsAsString[index]}
              status={status}
              statusIndex={index}
              handleTransitionsChange={this.handleTransitionsChange}
            />
          );
        })}
        {transitionsError && <p className="error-text">{transitionsError}</p>}
      </>
    );
  }

  renderDialog(): JSX.Element {
    const { isEditing } = this.props;
    const { open } = this.state;

    return (
      <Dialog open={open} onClose={this.handleClose} fullWidth>
        <DialogTitle classes={{ root: "dialog-title" }}>
          {isEditing ? "Edit Workflow" : "Add New Workflow"}
        </DialogTitle>
        <DialogContent>
          {this.renderNameField()}
          {this.renderTransitions()}
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

  handleNameValidation = (): boolean => {
    const { name } = this.state;

    const isNotValid = !name || name.length < 3 || name.length > 50;
    const nameError = "Please choose a name between 3 and 50 characters!";
    this.setState({
      nameError: isNotValid ? nameError : null,
    });

    return isNotValid;
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    this.setState({
      name: value,
      nameError: null,
    });
  };

  handleTransitionsChange = (statuses: Array<IStatus>, index: number) => {
    const newTransitions = [...this.state.transitions];
    newTransitions[index] = statuses;

    this.setState({
      transitions: newTransitions,
      transitionsError: null,
    });
  };

  handleTransitionsValidation = () => {
    const { transitions, transitionsError, nameForValidation } = this.state;
    const { statuses, issues, types } = this.props;
    const deadEndStatuses = this.workflowService.checkForDeadEndStatuses(
      transitions,
      statuses,
      transitionsError
    );

    if (deadEndStatuses) {
      const names = deadEndStatuses.map((s) => s.name);
      const isEmptyError = "Please select at least two status transitions";
      const deadEndError = `Please make sure there are no dead end statuses. Current dead end statuses: ${names.toString()}`;

      this.setState({
        transitionsError:
          deadEndStatuses.length > 0 ? deadEndError : isEmptyError,
      });

      return true;
    }

    const issueTypeError = this.workflowService.checkForIssueTypeError(
      nameForValidation,
      transitions,
      issues,
      types
    );

    if (issueTypeError) {
      this.setState({
        transitionsError: issueTypeError,
      });

      return true;
    }

    return false;
  };

  handleValidation = () => {
    const hasNameError = this.handleNameValidation();
    const hasTransitionError = this.handleTransitionsValidation();

    if (hasNameError || hasTransitionError) {
      return true;
    }

    return false;
  };

  handleSubmit = async () => {
    const { name, transitions } = this.state;
    const hasErrors = this.handleValidation();

    if (hasErrors) {
      return;
    }

    await this.props.successAction(name, transitions);
    this.handleClose();
  };

  handleClose = (): void => {
    if (this.props.isEditing) {
      this.handleCloseEditWorkflowDialog();
    } else {
      this.handleCloseCreateWorkflowDialog();
    }
  };

  handleCloseCreateWorkflowDialog = (): void => {
    const { statuses } = this.props;

    const stateAfterDialogClose = {
      open: false,
      name: "",
      nameError: null,
      transitions: Array.from(Array(statuses.length), () => []),
      transitionsError: "",
    };

    this.setState(stateAfterDialogClose);
  };

  handleCloseEditWorkflowDialog = (): void => {
    const { workflow, transitions } = this.props;

    const stateAfterDialogClose = {
      open: false,
      name: workflow!.name,
      nameError: null,
      transitions: transitions!,
      transitionsError: "",
    };

    this.setState(stateAfterDialogClose);
  };

  handleOpen = (): void => {
    this.setState({
      open: true,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
  statuses: state.statuses,
  workflows: state.workflows,
  types: state.types,
});

export default connect(mapStateToProps)(CreateEditWorkflow);
