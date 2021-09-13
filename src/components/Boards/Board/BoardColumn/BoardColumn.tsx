import { Grid, Paper } from "@material-ui/core";
import React, { Component, ReactNode } from "react";
import Issue from "components/Issue/Issue";
import { connect } from "react-redux";
import "components/Boards/Board/BoardColumn/BoardColumn.css";
import { AppDispatch, RootState } from "store/store";
import { IIssue, IStatus, IUser } from "common/models";
import { updateStatus } from "common/actions";

interface BoardColumnProps {
  title: string;
  status?: IStatus;
  count: number;
  issues: Array<IIssue>;
  assignee?: IUser;
  dispatch: AppDispatch;
}

class BoardColumn extends Component<BoardColumnProps> {
  render(): ReactNode {
    return (
      <Grid item xs={4}>
        <Paper
          className="paper"
          onDragEnter={this.handleDragEnter}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
        >
          <h1 className="board-heading">{this.props.title}</h1>
          <h1 className="board-heading"> ({this.props.count})</h1>
          {this.props.issues.map((issue: IIssue) => (
            <Issue key={issue.id} issue={issue} />
          ))}
        </Paper>
      </Grid>
    );
  }

  handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const newStatus = this.props.status;
    const data = e.dataTransfer.getData("text/plain").split(",");
    const issueId = +data[0];
    const targetAssignee = data[1];

    const notAValidDrop = this.handleDropValidation(targetAssignee);

    if (notAValidDrop) {
      return;
    }

    this.props.dispatch(updateStatus({ newStatus: newStatus!, issueId }));
  };

  handleDropValidation = (targetAssignee: string) => {
    const { assignee, status } = this.props;

    if (status === undefined) {
      return true;
    }

    if (assignee && targetAssignee !== assignee.name) {
      return true;
    }
  }

  handleDragOver = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };
}

const mapStateToProps = (state: RootState) => ({
  statuses: state.statuses,
});

export default connect(mapStateToProps)(BoardColumn);
