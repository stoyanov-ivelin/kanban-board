import { Card, CardContent, Typography, CardHeader, Avatar } from "@material-ui/core";
import { Component } from "react";

class Issue extends Component {
  render() {
    return (
      <Card style={{ maxWidth: "90%", margin: "auto", marginTop: "1em" }}>
        <CardContent>
          <Typography variant="h3" color="primary" align="left">
            Issue Name
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            align="left"
            style={{ marginBottom: "7em" }}
          >
            Issue description
          </Typography>
          <Typography variant="body1" color="secondary" align="left">
            Issue status
          </Typography>
        </CardContent>
        <CardHeader
          style={{ alignContent: "flex-start " }}
          avatar={
            <Avatar>
              <img
                alt="user"
                width="40px"
                src="https://mpng.subpng.com/20180523/tha/kisspng-businessperson-computer-icons-avatar-clip-art-lattice-5b0508dc6a3a10.0013931115270566044351.jpg"
              />
            </Avatar>
          }
          title="Assigne Name"
        />
      </Card>
    );
  }
}

export default Issue;
