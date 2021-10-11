import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Avatar,
} from "@material-ui/core";
import React, { Component, ReactNode } from "react";
import "components/Issue/Issue.css";
import { IIssue, IStatus } from "common/models";
import EditIssue from "components/Issue/CreateEditIssue/EditIssue/EditIssue";
import { Grid } from "@material-ui/core";
import { RootState } from "store/store";
import { connect } from "react-redux";

interface IssueProps {
  issue: IIssue;
  statuses: Array<IStatus>;
}

interface IssueState {
  showEditButton: boolean;
}

class Issue extends Component<IssueProps, IssueState> {
  constructor(props: IssueProps) {
    super(props);

    this.state = {
      showEditButton: false,
    };
  }

  render(): ReactNode {
    const { issue } = this.props;
    const { showEditButton } = this.state;
    const { title, description, assignee, status, type } = issue;

    return (
      <div>
        <Card
          className="card"
          draggable
          onDragStart={(e) => this.handleDragStart(e, issue.id)}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <CardContent>
            <Grid container justifyContent="space-between">
              <Typography variant="h4" color="primary">
                {title}
              </Typography>
              {showEditButton && <EditIssue issue={issue} />}
            </Grid>
            <Typography variant="body1" color="textSecondary" align="left">
              {description}
            </Typography>
            <Typography variant="h6" align="left">
              Status: {status!.name}
            </Typography>
            <Typography variant="h6" align="left">
              Type: {type}
            </Typography>
          </CardContent>
          <CardHeader
            avatar={
              <Avatar>
                <img
                  alt="user"
                  width="40px"
                  src="https://mpng.subpng.com/20180523/tha/kisspng-businessperson-computer-icons-avatar-clip-art-lattice-5b0508dc6a3a10.0013931115270566044351.jpg"
                />
              </Avatar>
            }
            title={assignee}
          />
        </Card>
      </div>
    );
  }

  handleMouseEnter = () => {
    this.setState({
      showEditButton: true,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      showEditButton: false,
    });
  };

  handleDragStart = (e: React.DragEvent, issueId: number): void => {
    e.dataTransfer.items.add(`text/plain`, `${issueId}`);
    e.dataTransfer.setData(
      "text/plain",
      `${issueId},${this.props.issue.assignee}`
    );
  };
}

const mapStateToProps = (state: RootState) => ({
  statuses: state.statuses,
});

export default connect(mapStateToProps)(Issue);
