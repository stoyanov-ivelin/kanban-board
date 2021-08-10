import { Grid, Paper } from "@material-ui/core";
import { Component } from "react";
import Issue from "./Issue";
import { Status } from "../common/constants";

const statuses = [Status.NEW, Status.IN_PROGRESS, Status.DONE];

class Board extends Component {
  render() {
    return (
      <Grid container justifyContent="center" spacing={2}>
        {statuses.map((value) => (
          <Grid item>
            <Paper style={{ height: "60em", width: "30em", overflow: "auto" }}>
              <h1>{value}</h1>
              <Issue />
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default Board;
