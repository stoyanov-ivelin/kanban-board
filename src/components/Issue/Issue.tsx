import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Avatar,
} from "@material-ui/core";
import React, { Component, ReactNode } from "react";
import { Status } from "common/constants";
import { IIssue } from "common/models";
import 'components/Issue/Issue.css';

interface IIssueProps {
  issue: IIssue,
  id: number,
}

class Issue extends Component<IIssueProps> {
  render(): ReactNode {
    let statusColor = "green";

    if (this.props.issue.status === Status.InProgress) {
      statusColor = "orange";
    } else if (this.props.issue.status === Status.Done) {
      statusColor = "blue";
    }

    return (
      <div>
        <Card
          draggable
          onDragStart={(e) => this.handleDragStart(e, this.props.id)}
          className="card"
        >
          <CardContent>
            <Typography variant="h4" color="primary" align="left">
              {this.props.issue.name}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              align="left"
              style={{ marginBottom: "1em" }}
            >
              {this.props.issue.description}
            </Typography>
            <Typography
              variant="h6"
              align="left"
              style={{ color: statusColor }}
            >
              {this.props.issue.status}
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
            title={this.props.issue.assignee}
          />
        </Card>
      </div>
    );
  }

  handleDragStart = (e: React.DragEvent, issueId: number): void => {
    e.dataTransfer.setData('text/plain', `${issueId}`);
  }
}

export default Issue;
