import { Grid, Typography } from "@material-ui/core";
import { IUser } from "common/models";
import CreateUser from "components/CreateEditUser/CreateUser/CreateUser";
import User from "components/Users/User/User";
import { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "store/store";
import "./Users.css";

interface UsersProps {
  users: Array<IUser>;
}

class Users extends Component<UsersProps> {
  render() {
    return (
      <Grid item>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          className="users-heading"
        >
          <Typography variant="h3">Users list</Typography>
          <CreateUser />
        </Grid>
        <Grid container spacing={10}>
          {this.props.users.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  users: state.users,
});

export default connect(mapStateToProps)(Users);
