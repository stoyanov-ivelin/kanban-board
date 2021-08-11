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
  count: number,
  issues: Array<IIssue>,
  dispatch: AppDispatch
}

class Board extends Component<IBoardProps> {
  handleDrop(e: React.DragEvent) {
    e.preventDefault();
  
    const newStatus = e.currentTarget.childNodes[0].textContent!;
    this.props.dispatch(updateStatus(newStatus));
  }

  handleDragOver(e: React.DragEvent): void {
    e.stopPropagation();
    e.preventDefault();
  }

  handleDragEnter(e: React.DragEvent): void {
    e.preventDefault();
  }

  handleDragEnd(e: React.DragEvent): void {
    e.preventDefault();
  }

  render(): ReactNode {
    return (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <Paper
            className="paper"
            style={{backgroundColor: "lightgrey"}}
            onDragEnter={(e) => this.handleDragEnter(e)}
            onDrop={(e) => this.handleDrop(e)}
            onDragEnd={(e) => this.handleDragEnd(e)}
            onDragOver={(e) => this.handleDragOver(e)}
          >
            <h1 style={{ display: "inline" }}>{this.props.title}</h1>
            <h1 style={{ display: "inline" }}> ({this.props.count})</h1>
            {this.props.issues.map((issue: IIssue) => (
              <Issue
                key={issue.id}
                issue={issue}
                id={issue.id}
                dispatch={this.props.dispatch}
              />
            ))}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default connect()(Board);
