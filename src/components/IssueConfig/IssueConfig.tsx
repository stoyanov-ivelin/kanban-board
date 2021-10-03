import { Grid, IconButton, TextField, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { createStatus, deleteStatus } from "common/actions";
import { IStatus, IWorkflow } from "common/models";
import { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import "./IssueConfig.css";

interface IssueConfigProps {
  statuses: Array<IStatus>;
  workflows: Array<IWorkflow>;
  dispatch: AppDispatch;
}

interface IssueConfigState {
  showAddStatusField: boolean;
  status: string;
  statusError: string;
  workflowError: string;
}

class IssueConfig extends Component<IssueConfigProps, IssueConfigState> {
  constructor(props: IssueConfigProps) {
    super(props);

    this.state = {
      showAddStatusField: false,
      status: "",
      statusError: "",
      workflowError: "",
    };
  }

  render() {
    const { showAddStatusField } = this.state;
    const { statuses } = this.props;

    return (
      <Grid container justifyContent="flex-start">
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <Typography
              className="issue-config-heading"
              align="left"
              variant="h2"
            >
              Issue Config
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4">Statuses</Typography>
          </Grid>
        </Grid>
        <Grid
          container
          className="statuses-grid-container"
          justifyContent="space-between"
        >
          {statuses.map((status, index) => {
            if (!status) {
              return null;
            }

            return (
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                key={index}
              >
                {status.name}
                <Grid item>
                  <IconButton onClick={() => this.handleDelete(status.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}
          <Grid container justifyContent="center">
            {showAddStatusField ? (
              this.renderAddStatusField()
            ) : (
              <Grid item>
                <IconButton
                  onClick={this.handleClickOpen}
                  color="primary"
                  size="medium"
                >
                  <AddIcon />
                  Add new status
                </IconButton>
              </Grid>
            )}
            {this.renderWorkflowError()}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  renderWorkflowError() {
    const { workflowError } = this.state;

    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={Boolean(workflowError)}
        autoHideDuration={2000}
        onClose={this.handleSnackBarClose}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {workflowError}
        </Alert>
      </Snackbar>
    );
  }

  renderAddStatusField() {
    const { status, statusError } = this.state;
    return (
      <>
        <TextField
          onChange={this.handleStatusChange}
          defaultValue={status}
          margin="dense"
          placeholder="Enter status..."
          helperText={statusError}
          error={statusError !== ""}
        />
        <IconButton color="secondary" onClick={this.handleSubmit}>
          <CheckIcon />
        </IconButton>
        <IconButton color="secondary" onClick={this.handleClickClose}>
          <CloseIcon />
        </IconButton>
      </>
    );
  }

  handleValidation = () => {
    const { status } = this.state;

    if (status.length < 3 || status.length > 50) {
      this.setState({
        statusError: "Please enter a status between 3 and 50 characters",
      });

      return true;
    }

    const statusAlreadyExists = this.props.statuses.find(
      (existingStatus) => existingStatus.name === status.toLowerCase().trim()
    );

    if (statusAlreadyExists) {
      this.setState({
        statusError: "This status already exists!",
      });

      return true;
    }
  };

  handleDeleteValidation = (id: number) => {
    const { statuses, workflows } = this.props;
    let hasErrors = false;
    let hasDeadEndStatus = false;
    const statusToDelete = statuses.find((s) => s.id === id)!;
    const transitionsArray: Array<Array<IStatus>> = [];

    workflows.forEach((workflow) => {
      workflow.transitions.forEach((transition) => {
        transitionsArray.push(transition);
      });

      const flattenedTransitions = transitionsArray.flat();

      workflow.transitions.forEach((transition, statusKey) => {
        if (transition.length === 1 && transition[0].id === statusToDelete.id) {
          workflow.transitions.forEach((innerTransition) => {
            const becomesDeadEndStatus = innerTransition.some(
              (s) => s.id === statusKey.id
            );

            if (becomesDeadEndStatus) {
              hasErrors = true;
              return;
            }
          });
        } else if (statusKey.id === statusToDelete.id) {
          transition.forEach((status) => {
            const becomesDeadEndStatus =
              flattenedTransitions.filter((s) => s.id === status.id).length < 2;

            if (becomesDeadEndStatus) {
              hasErrors = true;
              return;
            }
          });
        }
      });

      hasDeadEndStatus = !flattenedTransitions.some(
        (transitionStatus) => transitionStatus.id === statusToDelete.id
      );
    });

    if (hasErrors || hasDeadEndStatus) {
      return true;
    }

    return false;
  };

  handleDelete = (id: number) => {
    const hasErrors = this.handleDeleteValidation(id);
    if (hasErrors) {
      this.setState({
        workflowError:
          "Deleting this status will lead to dead end statuses in at least one workflow!",
      });
      return;
    }

    this.props.dispatch(deleteStatus(id));
  };

  handleSubmit = () => {
    const { status } = this.state;
    const hasError = this.handleValidation();

    if (hasError) {
      return;
    }

    this.props.dispatch(createStatus(status));
    this.handleClickClose();
  };

  handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    this.setState({
      status: value,
    });
  };

  handleClickOpen = () => {
    this.setState({
      showAddStatusField: true,
    });
  };

  handleClickClose = () => {
    this.setState({
      showAddStatusField: false,
      status: "",
      statusError: "",
    });
  };

  handleSnackBarClose = () => {
    this.setState({
      workflowError: "",
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  statuses: state.statuses,
  workflows: state.workflows,
});

export default connect(mapStateToProps)(IssueConfig);
