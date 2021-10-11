import { Grid, Paper } from "@material-ui/core";
import React, { Component, ReactNode } from "react";
import Issue from "components/Issue/Issue";
import { connect } from "react-redux";
import "components/Boards/Board/BoardColumn/BoardColumn.css";
import { AppDispatch, RootState } from "store/store";
import { IIssue, IStatus, IType, IUser, IWorkflow } from "common/models";
import { updateStatus } from "common/actions";
import { keys } from "lodash";

interface BoardColumnProps {
  title: string;
  status?: IStatus;
  count: number;
  issues: Array<IIssue>;
  filteredIssues: Array<IIssue>;
  columnStatuses: Array<IStatus>;
  statuses: Array<IStatus>;
  types: Array<IType>;
  workflows: Array<IWorkflow>;
  assignee?: IUser;
  dispatch: AppDispatch;
}

interface BoardColumnState {
  notAValidDrop: boolean;
}

class BoardColumn extends Component<BoardColumnProps, BoardColumnState> {
  constructor(props: BoardColumnProps) {
    super(props);

    this.state = {
      notAValidDrop: false,
    };
  }

  render(): ReactNode {
    const { notAValidDrop } = this.state;

    return (
      <Grid item className="board-column">
        <Paper
          className={notAValidDrop ? "paper-invalid-drop" : "paper"}
          onDragEnter={this.handleDragEnter}
          onDragOver={this.handleDragOver}
          onDragLeave={this.handleDragLeave}
          onDrop={this.handleDrop}
        >
          <h1 className="board-heading">{this.props.title}</h1>
          <h1 className="board-heading"> ({this.props.count})</h1>
          {this.props.filteredIssues.map((issue: IIssue) => (
            <Issue key={issue.id} issue={issue} />
          ))}
        </Paper>
      </Grid>
    );
  }

  findColumnDropStatus(issueId: number) {
    const { issues, types, workflows, statuses, columnStatuses } = this.props;

    const { type } = issues.find((i) => i.id === +issueId)!;
    const { workflow } = types.find((t) => t.name === type)!;
    const { transitions } = workflows.find((w) => w.name === workflow)!;

    const validStatusesIds = Array.from(transitions.values())
      .flat()
      .map((s) => s.id);
    const columnStatusesIds = columnStatuses.map((s) => s.id);
    const defaultStatusId = columnStatusesIds.find((id) =>
      validStatusesIds.includes(id)
    )!;

    const newStatus = statuses.find((s) => s.id === defaultStatusId)!;

    return newStatus;
  }

  handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain").split(",");
    const issueId = +data[0];
    const targetAssignee = data[1];

    const notAValidDrop = this.handleDropValidation(targetAssignee);

    if (notAValidDrop || this.state.notAValidDrop) {
      this.setState({
        notAValidDrop: false,
      });

      return;
    }

    const newStatus = this.findColumnDropStatus(issueId);

    this.props.dispatch(updateStatus({ newStatus, issueId }));
  };

  handleDropValidation = (targetAssignee: string) => {
    const { assignee, status } = this.props;

    if (status === undefined) {
      return true;
    }

    if (assignee && targetAssignee !== assignee.name) {
      return true;
    }

    return false;
  };

  handleDragOver = (e: React.DragEvent) => {
    const issueId = +e.dataTransfer.items[1].type;

    const notAValidDrop = this.handleDragOverValidation(issueId);
    if (notAValidDrop) {
      this.setState({
        notAValidDrop,
      });
    }

    e.stopPropagation();
    e.preventDefault();
  };

  handleDragOverValidation = (issueId: number) => {
    const { issues, types, workflows, columnStatuses } = this.props;

    const issue = issues.find((i) => i.id === issueId);
    if (!issue) {
      return;
    }

    const { workflow } = types.find((t) => t.name === issue.type)!;
    const { transitions } = workflows.find((w) => w.name === workflow)!;
    let validStatusesIds: Array<number> = [];
    let notAValidDrop = true;

    transitions.forEach((transition, keyStatus) => {
      if (keyStatus.id === issue.status.id) {
        validStatusesIds = transition.map((s) => s.id);
      }
    }); 

    columnStatuses.forEach((s) => {
      if (validStatusesIds.includes(s.id)) {
        notAValidDrop = false;
        return;
      }
    });

    return notAValidDrop;
  };

  handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  handleDragLeave = (e: React.DragEvent) => {
    this.setState({
      notAValidDrop: false,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
  workflows: state.workflows,
  types: state.types,
  statuses: state.statuses,
});

export default connect(mapStateToProps)(BoardColumn);
