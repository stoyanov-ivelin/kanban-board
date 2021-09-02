import { Grid, Paper } from "@material-ui/core";
import React, { Component, ReactNode } from "react";
import Issue from "components/Issue/Issue";
import { connect } from "react-redux";
import "components/Boards/Board/BoardColumn/BoardColumn.css";
import { AppDispatch, RootState } from "store/store";
import { IBoard, IIssue, IUser } from "common/models";
import { updateStatus } from "common/actions";

interface BoardColumnProps {
  boards: Array<IBoard>;
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

    this.props.dispatch(updateStatus({ newStatus, issueId }));
  };

  handleDropValidation = (targetAssignee: string) => {
    const { assignee, boards, title } = this.props;

    const column = boards.map((board) => {
      return board.columns.find((column) => column.name === title);
    })[0];

    if (column?.statuses.length === 0) {
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
  boards: state.boards,
  statuses: state.statuses,
});

export default connect(mapStateToProps)(BoardColumn);
