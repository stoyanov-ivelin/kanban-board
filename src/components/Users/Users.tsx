import { Container, Grid } from "@material-ui/core";
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
      <div>
        <Container>
          <div className="users-heading">
            <h1>Users list</h1>
            <CreateUser />
          </div>
          <Grid container spacing={10}>
            {this.props.users.map((user) => (
              <User user={user} />
            ))}
          </Grid>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  users: state.users,
});

export default connect(mapStateToProps)(Users);
