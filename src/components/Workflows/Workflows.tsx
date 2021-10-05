import { Grid, Typography } from "@material-ui/core";
import { IStatus, IWorkflow } from "common/models";
import { diTypes } from "dependencyTypes";
import { resolve } from "inversify-react";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IWorkflowService } from "services/workflow/model";
import { AppDispatch, RootState } from "store/store";
import "reflect-metadata";
import { deleteWorkflow } from "common/actions";
import Button from "@mui/material/Button";
import "./Workflows.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { Stack } from "@mui/material";
import CreateWorkflow from "components/Workflows/CreateEditWorkflow/CreateWorkflow/CreateWorkflow";
import EditWorkflow from "components/Workflows/CreateEditWorkflow/EditWorkflow/EditWorkflow";

export interface WorkflowsProps {
  workflows: Array<IWorkflow>;
  statuses: Array<IStatus>;
  dispatch: AppDispatch;
}

class Workflows extends Component<WorkflowsProps> {
  @resolve(diTypes.IWorkflowService) private workflowService: IWorkflowService;

  render() {
    return (
      <Grid container>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          className="workflow-heading"
        >
          <Typography variant="h2">Workflows</Typography>
          <Grid item>
            <CreateWorkflow />
          </Grid>
        </Grid>
        {this.renderWorkflows()}
      </Grid>
    );
  }

  renderWorkflows() {
    const { statuses, workflows } = this.props;

    return (
      <>
        {workflows.map((workflow: IWorkflow, index) => {
          const { transitions } = workflow;
          const {
            parseTransitionsToKeyValuePair,
            getAllValuesOfTransitionsMap,
          } = this.workflowService;

          const pairs = parseTransitionsToKeyValuePair(transitions);
          const statusTransitions = getAllValuesOfTransitionsMap(transitions);

          return (
            <div key={index}>
              <Stack
                direction="row"
                spacing={3}
                className="edit-delete-buttons"
              >
                <EditWorkflow
                  transitions={statusTransitions}
                  workflow={workflow}
                  index={index}
                />
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  variant="contained"
                  onClick={() => this.handleDelete(workflow.name)}
                >
                  Delete Workflow
                </Button>
              </Stack>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, border: 2 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell className="title-table-cell">
                        Workflow: {workflow.name}
                      </TableCell>
                      {statuses.map((status) => (
                        <TableCell
                          className="title-table-cell"
                          align="center"
                          key={status.id}
                        >
                          {status.name}
                          <Typography variant="h5">
                          ↓
                          </Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 2 } }}
                    >
                      <TableCell
                        className="title-table-cell"
                        component="th"
                        scope="row"
                      >
                        Transitions
                      </TableCell>
                      {pairs.map((keyValuePair, index) => {
                        const validStatuses = keyValuePair.split(";")[1];

                        return (
                          <TableCell
                            className="transitions-table-cell"
                            align="center"
                            key={index}
                          >
                            {validStatuses ? validStatuses : "no statuses"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          );
        })}
      </>
    );
  }

  handleDelete = (name: string) => {
    this.props.dispatch(deleteWorkflow({ name }));
  };
}

const mapStateToProps = (state: RootState) => ({
  workflows: state.workflows,
  statuses: state.statuses,
});

export default connect(mapStateToProps)(Workflows);
