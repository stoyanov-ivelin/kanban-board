import { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { Grid, IconButton, TextField, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { IIssue, IType, IWorkflow } from "common/models";
import { resolve } from "inversify-react";
import { diTypes } from "dependencyTypes";
import { IIssueTypeService } from "services/issue-type/model";
import { createType, deleteType, editType } from "common/actions";
import Stack from "@mui/material/Stack";
import EditIcon from "@material-ui/icons/Edit";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./IssueTypes.css";

interface IssueTypeProps {
  issues: Array<IIssue>;
  workflows: Array<IWorkflow>;
  types: Array<IType>;
  dispatch: AppDispatch;
}

interface IssueTypeState {
  showAddEditTypeFields: boolean;
  isEditing: boolean;
  typeIndex: number | null;
  name: string;
  nameError: string;
  workflow: string;
  workflowError: string;
  deleteErorr: string;
}

class IssueTypes extends Component<IssueTypeProps, IssueTypeState> {
  @resolve(diTypes.IIssueTypeService)
  private issueTypeService: IIssueTypeService;

  constructor(props: IssueTypeProps) {
    super(props);

    this.state = {
      showAddEditTypeFields: false,
      isEditing: false,
      typeIndex: null,
      name: "",
      nameError: "",
      workflow: this.props.workflows[0].name,
      workflowError: "",
      deleteErorr: "",
    };
  }

  render() {
    return (
      <Grid>
        <Stack className="types-stack" spacing={3}>
          <Typography variant="h4" align="left">
            Types
          </Typography>
          {this.props.types.map((type, index) => (
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item className="type-name">
                {type.name}
              </Grid>
              <Grid item>{"---->"}</Grid>
              <Grid item>{type.workflow}</Grid>
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    {this.renderEditType(index, type.name, type.workflow)}
                  </Grid>
                  <Grid item>{this.renderDeleteType(type.name)}</Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
          {this.renderAddEditType()}
        </Stack>
        {this.renderDeleteError()}
      </Grid>
    );
  }

  renderDeleteError() {
    const { deleteErorr } = this.state;

    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={Boolean(deleteErorr)}
        autoHideDuration={4000}
        onClose={this.handleSnackBarClose}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {deleteErorr}
        </Alert>
      </Snackbar>
    );
  }

  renderDeleteType(name: string) {
    return (
      <>
        <IconButton onClick={() => this.handleDelete(name)}>
          <DeleteIcon />
        </IconButton>
      </>
    );
  }

  renderEditType(
    typeIndex: number,
    existingTypeName: string,
    existingTypeWorkflow: string
  ) {
    return (
      <>
        {!this.state.isEditing ? (
          <IconButton
            onClick={() =>
              this.setState({
                showAddEditTypeFields: true,
                isEditing: true,
                typeIndex,
                name: existingTypeName,
                workflow: existingTypeWorkflow,
              })
            }
            color="primary"
            size="medium"
          >
            <EditIcon />
          </IconButton>
        ) : (
          <Grid item className="edit-button-empty-replacement" />
        )}
      </>
    );
  }

  renderAddEditType() {
    const { showAddEditTypeFields } = this.state;

    return (
      <>
        {showAddEditTypeFields ? (
          <>{this.renderAddEditTypeFields()}</>
        ) : (
          <Grid item>
            <IconButton
              onClick={this.handleClickOpen}
              color="primary"
              size="medium"
            >
              <AddIcon />
              Add new type
            </IconButton>
          </Grid>
        )}
      </>
    );
  }

  renderAddEditTypeFields() {
    return (
      <>
        {this.renderAddEditTypeNameField()}
        {this.renderAddEditTypeSelectField()}
      </>
    );
  }

  renderAddEditTypeNameField() {
    const { name, nameError, typeIndex } = this.state;
    const submit =
      typeIndex === null ? this.handleAddSubmit : this.handleEditSubmit;

    return (
      <Grid container>
        <TextField
          onChange={this.handleNameChange}
          defaultValue={name}
          margin="dense"
          placeholder="Enter name..."
          helperText={nameError}
          error={nameError !== ""}
        />
        <IconButton color="secondary" onClick={submit}>
          <CheckIcon />
        </IconButton>
        <IconButton color="secondary" onClick={this.handleClickClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
    );
  }

  renderAddEditTypeSelectField() {
    const { workflows } = this.props;
    const { workflow, workflowError } = this.state;

    return (
      <>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="select-workflow-label">Workflow</InputLabel>
          <Select
            labelId="select-workflow-label"
            label="Workflow"
            value={workflow}
            onChange={this.handleSelectWorkflowChange}
            error={Boolean(workflowError)}
          >
            {workflows.map((workflow) => {
              return (
                <MenuItem key={workflow.name} value={workflow.name}>
                  {workflow.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {workflowError && <p className="error-text">{workflowError}</p>}
      </>
    );
  }

  handleDelete = (name: string) => {
    const error = this.checkForDeleteError(name);
    if (error) {
      this.setState({
        deleteErorr: error,
      });
      return;
    }

    this.props.dispatch(deleteType({ name }));
  };

  checkForDeleteError = (name: string) => {
    const { issues } = this.props;
    const error = this.issueTypeService.checkForErrorOnDelete(name, issues);

    return error;
  };

  handleEditSubmit = () => {
    const { typeIndex, name, workflow } = this.state;

    const error = this.handleEditValidation();

    if (error) {
      return;
    }

    this.props.dispatch(editType({ typeIndex: typeIndex!, name, workflow }));
    this.handleClickClose();
  };

  handleAddSubmit = () => {
    const { name, workflow } = this.state;
    const error = this.handleAddValidation();

    if (error) {
      return;
    }

    this.props.dispatch(createType({ name, workflow }));
    this.handleClickClose();
  };

  handleAddValidation = () => {
    const { name } = this.state;
    const { types } = this.props;

    const error = this.issueTypeService.checkForErrorOnAdd(name, types);
    if (error) {
      this.setState({
        nameError: error,
      });
    }

    return error;
  };

  handleEditValidation = () => {
    const { typeIndex, name, workflow } = this.state;
    const { issues, workflows, types } = this.props;

    const error = this.issueTypeService.checkForErrorOnEdit(
      typeIndex!,
      name,
      workflow,
      types,
      issues,
      workflows
    );

    if (error && error.startsWith("Can't")) {
      this.setState({
        workflowError: error,
      });
    } else if (error) {
      this.setState({
        nameError: error,
      });
    }

    return error;
  };

  handleSelectWorkflowChange = (event: SelectChangeEvent) => {
    const { value } = event.target;

    this.setState({
      workflow: value,
    });
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    this.setState({
      name: value,
      nameError: "",
    });
  };

  handleClickOpen = () => {
    this.setState({
      showAddEditTypeFields: true,
      isEditing: true,
    });
  };

  handleClickClose = () => {
    this.setState({
      showAddEditTypeFields: false,
      isEditing: false,
      typeIndex: null,
      name: "",
      nameError: "",
      workflow: this.props.workflows[0].name,
      workflowError: "",
    });
  };

  handleSnackBarClose = () => {
    this.setState({
      deleteErorr: "",
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
  workflows: state.workflows,
  types: state.types,
});

export default connect(mapStateToProps)(IssueTypes);
