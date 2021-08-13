import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import "App.css";
import { Status } from "common/constants";
import Board from "components/Board/Board";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { RootState } from "store/store";
import { IIssue } from "common/models";

type Acc = {
  new: Array<IIssue>;
  inProgress: Array<IIssue>;
  done: Array<IIssue>;
};

class App extends Component<RootState> {
  render(): ReactNode {
    const filteredIssues = this.props.issues.reduce(
      (acc: Acc, issue: IIssue) => {
        if (issue.status === Status.New) {
          acc.new.push(issue);
        } else if (issue.status === Status.InProgress) {
          acc.inProgress.push(issue);
        } else {
          acc.done.push(issue);
        }

        return acc;
      },
      { new: [], inProgress: [], done: [] }
    );

    const newIssues = filteredIssues.new;
    const inProgressIssues = filteredIssues.inProgress;
    const doneIssues = filteredIssues.done;

    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar className="toolbar">
            <Typography variant="h5">User Name</Typography>
            <AccountCircle className="account-icon" />
          </Toolbar>
        </AppBar>
        <h1 className="heading">Kanban Board</h1>
        <div className="column-grid">
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
});

export default connect(mapStateToProps)(App);
