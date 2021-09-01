import { FormControl, Grid, NativeSelect, Typography } from "@material-ui/core";
import React, { Component } from "react";
import "components/Boards/Boards.css";
import Board from "components/Boards/Board/Board";
import { IBoard, IIssue, IUser } from "common/models";
import CreateIssue from "components/Issue/CreateEditIssue/CreateIssue/CreateIssue";
import { groupBy } from "common/constants";

interface BoardsProps {
  issues: Array<IIssue>;
  users: Array<IUser>;
  boards: Array<IBoard>;
}

interface BoardsState {
  groupBy: groupBy;
  selectedBoardName: string;
}

class Boards extends Component<BoardsProps, BoardsState> {
  constructor(props: BoardsProps) {
    super(props);

    this.state = {
      groupBy: groupBy.NO_GROUPING,
      selectedBoardName: "Default",
    };
  }
  render() {
    const { groupBy, selectedBoardName } = this.state;

    return (
      <div>
        <Grid
          container
          className="heading"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Grid className="heading" item xs={3}>
            <Typography variant="h3">Kanban Board</Typography>
              <FormControl className="select-group-by">
                <NativeSelect onChange={this.handleGroupBy}>
                  <option value="">No grouping</option>
                  <option value="assignee">Group by assignee</option>
                </NativeSelect>
              </FormControl>
          </Grid>
          <Grid item xs={5}>
            <CreateIssue />
          </Grid>
          <Grid container spacing={8} className="board-grid-container">
          <Board groupBy={groupBy} selectedBoardName={selectedBoardName}></Board>
          </Grid>
        </Grid>
      </div>
    );
  }

  handleGroupBy = (e: React.ChangeEvent<{ value: string }>) => {
    const selectedGroupBy = e.target.value;

    this.setState({
      groupBy: selectedGroupBy as groupBy,
    });
  };
}

export default Boards;
