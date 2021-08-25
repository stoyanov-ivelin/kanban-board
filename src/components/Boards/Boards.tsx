import { Grid, Typography } from "@material-ui/core";
import { Component } from "react";
import { connect } from "react-redux";
import "components/Boards/Boards.css";
import { Status } from "common/constants";
import Board from "components/Board/Board";
import { RootState } from "store/store";
import { IIssue } from "common/models";
import CreateIssue from "components/Issue/CreateEditIssue/CreateIssue/CreateIssue";

interface FilteredIssues {
  new: Array<IIssue>;
  inProgress: Array<IIssue>;
  done: Array<IIssue>;
};

interface BoardsProps {
  issues: Array<IIssue>;
}

class Boards extends Component<BoardsProps> {
  render() {
    const filteredIssues = this.props.issues.reduce(
      (filteredIssues: FilteredIssues, issue: IIssue) => {
        if (issue.status === Status.New) {
          filteredIssues.new.push(issue);
        } else if (issue.status === Status.InProgress) {
          filteredIssues.inProgress.push(issue);
        } else {
          filteredIssues.done.push(issue);
        }

        return filteredIssues;
      },
      { new: [], inProgress: [], done: [] }
    );

    const newIssues = filteredIssues.new;
    const inProgressIssues = filteredIssues.inProgress;
    const doneIssues = filteredIssues.done;
    return (
      <div>
          <Grid className="heading" container alignItems="center" justifyContent="flex-end">
            <Grid item xs={7}>
              <Typography variant="h3">Kanban Board</Typography>
            </Grid>
            <Grid item xs={3}>
              <CreateIssue />
            </Grid>
          </Grid>
        <Grid container justifyContent="center" spacing={10}>
          <Board
            title="New"
            status={Status.New}
            count={newIssues.length}
            issues={newIssues}
          />
          <Board
            title="In Progress"
            status={Status.InProgress}
            count={inProgressIssues.length}
            issues={inProgressIssues}
          />
          <Board
            title="Done"
            status={Status.Done}
            count={doneIssues.length}
            issues={doneIssues}
          />
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
});

export default connect(mapStateToProps)(Boards);
