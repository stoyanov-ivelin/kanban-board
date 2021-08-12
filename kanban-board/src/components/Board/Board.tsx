import { Grid, Paper } from "@material-ui/core";
import React, { Component, ReactNode } from "react";
import Issue from "../Issue/Issue";
import { connect } from "react-redux";
import './Board.css';
import { AppDispatch } from "../../store/store";
import { IIssue } from "../../common/types";
import { updateStatus } from "../../common/actions";

interface IBoardProps {
  title: string,
  status: string,
  count: number,
  issues: Array<IIssue>,
  dispatch: AppDispatch
}

class Board extends Component<IBoardProps> {
  render(): ReactNode {
    return (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <Paper
            className="paper"
            style={{backgroundColor: "lightgrey"}}
            onDragEnter={(e) => this.handleDragEnter(e)}
            onDragOver={(e) => this.handleDragOver(e)}
            onDrop={(e) => this.handleDrop(e)}
          >
            <h1 className="board-heading">{this.props.title}</h1>
            <h1 className="board-heading"> ({this.props.count})</h1>
            {this.props.issues.map((issue: IIssue) => (
              <Issue
                key={issue.id}
                issue={issue}
                id={issue.id}
              />
            ))}
          </Paper>
        </Grid>
      </Grid>
    );
  }

  handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const newStatus = this.props.status;
    const issueId = +e.dataTransfer.getData('text/plain');

    this.props.dispatch(updateStatus({ newStatus, issueId }));
  }

  handleDragOver(e: React.DragEvent): void {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragEnter(e: React.DragEvent): void {
    e.preventDefault();
  }
}

export default connect()(Board);
