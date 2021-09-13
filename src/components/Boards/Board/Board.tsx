import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import "components/Boards/Board/Board.css";
import { AppDispatch, RootState } from "store/store";
import { IBoard, IIssue, IStatus, IUser } from "common/models";
import BoardColumn from "components/Boards/Board/BoardColumn/BoardColumn";
import { Grid, Avatar } from "@material-ui/core";
import { GroupBy } from "common/constants";

interface BoardProps {
  groupBy: GroupBy;
  selectedBoardName: string;
  issues: Array<IIssue>;
  users: Array<IUser>;
  boards: Array<IBoard>;
  statuses: Array<IStatus>;
  dispatch: AppDispatch;
}

class Board extends Component<BoardProps> {
  render(): ReactNode {
    const boardToRender = this.props.boards.find(
      (board) => board.name === this.props.selectedBoardName
    );

    return <>{this.renderBoard(boardToRender!)}</>;
  }

  renderBoard(boardToRender: IBoard) {
    const { groupBy } = this.props;

    switch (groupBy) {
      case "":
        return this.renderBoardNoGrouping(boardToRender);
      case "assignee":
        return this.renderBoardGroupByAssignee(boardToRender);
    }
  }

  renderBoardGroupByAssignee(boardToRender: IBoard): JSX.Element {
    return (
      <>
        {this.props.users.map((user) => (
          <>
            <Grid item container alignItems="center" justifyContent="center">
              <Avatar src={user.profilePicture} />
              <Grid item>
                <h2>{user.name}</h2>
              </Grid>
            </Grid>
            {boardToRender.columns.map((column) => {
              const filteredIssues = this.props.issues.filter(
                (issue) =>
                  issue.assignee === user.name &&
                  column.statuses.includes(issue.status)
              );

              const defaultDragAndDropStatus = column.statuses[0];

              return (
                <BoardColumn
                  title={column.name}
                  status={defaultDragAndDropStatus}
                  count={filteredIssues.length}
                  issues={filteredIssues}
                  assignee={user}
                />
              );
            })}
          </>
        ))}
      </>
    );
  }

  renderBoardNoGrouping(boardToRender: IBoard): JSX.Element {
    return (
      <>
        {boardToRender.columns.map((column) => {
          const filteredIssues = this.props.issues.filter((issue) =>
            column.statuses.includes(issue.status)
          );
          const defaultDragAndDropStatus = column.statuses[0];

          return (
            <BoardColumn
              title={column.name}
              status={defaultDragAndDropStatus}
              count={filteredIssues.length}
              issues={filteredIssues}
            />
          );
        })}
      </>
    );
  }

  getStatusById(id: number) {
    return this.props.statuses.find((status) => status.id === id);
  }
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
  users: state.users,
  boards: state.boards,
  statuses: state.statuses,
});

export default connect(mapStateToProps)(Board);
