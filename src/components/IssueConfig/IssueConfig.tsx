import {
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { createStatus, deleteStatus } from "common/actions";
import { IStatus } from "common/models";
import { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import "./IssueConfig.css";

interface IssueConfigProps {
  statuses: Array<IStatus>;
  defaultStatus: IStatus | undefined;
  dispatch: AppDispatch;
}

interface IssueConfigState {
  showAddIssueField: boolean;
  status: string;
  statusError: string;
}

class IssueConfig extends Component<IssueConfigProps, IssueConfigState> {
  constructor(props: IssueConfigProps) {
    super(props);

    this.state = {
      showAddIssueField: false,
      status: "",
      statusError: "",
    };
  }

  render() {
    return (
      <Container>
        <Grid justifyContent="flex-start" container spacing={10}>
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
          {this.props.statuses.map((status) => {
            if (status.isDeleted) {
              return null;
            }

            return (
              <>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {status.name}
                  <Grid item>
                    <IconButton onClick={() => this.handleDelete(status.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </>
            );
          })}
          <Grid container justifyContent="center">
            {this.state.showAddIssueField ? (
              this.renderStatusField()
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
          </Grid>
        </Grid>
      </Container>
    );
  }

  renderStatusField() {
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

  handleDelete = (id: number) => {
    const status = this.props.statuses.find(
      (status) => status.id === id
    );

    if (status === this.props.defaultStatus!) {
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
      showAddIssueField: true,
    });
  };

  handleClickClose = () => {
    this.setState({
      showAddIssueField: false,
      status: "",
      statusError: "",
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  statuses: state.statuses,
  defaultStatus: state.statuses.find((status) => status.isDefault === true),
});

export default connect(mapStateToProps)(IssueConfig);
