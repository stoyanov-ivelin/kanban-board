import { Grid, Paper } from "@material-ui/core";
import React, { Component, ReactNode } from "react";
import Issue from "components/Issue/Issue";
import { connect } from "react-redux";
import "components/Boards/Board/BoardColumn/BoardColumn.css";
import { AppDispatch } from "store/store";
import { IIssue, IUser } from "common/models";
import { updateStatus } from "common/actions";

interface BoardColumnProps {
  title: string;
  status: string;
  count: number;
  issues: Array<IIssue>;
  assignee?: IUser;
  dispatch: AppDispatch;
}

class BoardColumn extends Component<BoardColumnProps> {
  render(): ReactNode {
    return (
      <Grid item spacing={3} xs={4}>
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
    const {  assignee } = this.props;
    const newStatus = this.props.status;
    const data = e.dataTransfer.getData("text/plain").split(",");
    const issueId = +data[0];
    const targetAssignee = data[1];

    if (assignee && targetAssignee !== assignee.name) {
      return;
    }

    this.props.dispatch(updateStatus({ newStatus, issueId }));
  };

  handleDragOver = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };
}

export default connect()(BoardColumn);
