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
import { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import "./IssueConfig.css";

interface IssueConfigProps {
  statuses: Array<string>;
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
          {this.props.statuses.map((status, index) => (
            <>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                {status}
                <Grid item>
                  <IconButton onClick={() => this.handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </>
          ))}
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
      })

    return true;;
    }
  }

  handleDelete = (index: number) => {
    this.props.dispatch(deleteStatus(index));
  }
  
  handleSubmit = () => {
    const { status } = this.state;
    const hasError = this.handleValidation();

    if (hasError) {
      return;
    }

    this.props.dispatch(createStatus(status));
    this.handleClickClose();
  }

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
});

export default connect(mapStateToProps)(IssueConfig);
