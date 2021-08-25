import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { SkillsImages } from "common/constants";
import { IUser } from "common/models";
import SideNav from "components/SideNav/SideNav";
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
        <SideNav />
        <Container>
          <div className="users-heading">
            <h1>Users list</h1>
            <button>Add new user</button>
          </div>
          <Grid container spacing={10}>
            {this.props.users.map((user) => (
              <Grid item xs={4}>
                <Card
                  variant="outlined"
                  style={{ borderWidth: "1px", borderColor: "black", height: "380px" }}
                >
                  <CardHeader
                    style={{ textAlign: "left" }}
                    avatar={<Avatar src={user.profilePicture} />}
                    title={user.name}
                    subheader={user.jobPosition}
                  />
                  <CardContent>
                    <Tooltip arrow title={user.description}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className="tooltip"
                      >
                        {user.description}
                      </Typography>
                    </Tooltip>
                    {user.skills.map((skill, index) => (
                      <List dense>
                        {index < 3 && (
                          <ListItem>
                            <ListItemAvatar>
                              {/* @ts-ignore */}
                              <Avatar src={SkillsImages[skill]} />
                            </ListItemAvatar>
                            {skill}
                          </ListItem>
                        )}
                        {index === 3 && (
                          <Tooltip
                            arrow
                            title={user.skills.slice(3).join(", ")}
                          >
                            <div>... {user.skills.length - 3} more</div>
                          </Tooltip>
                        )}
                      </List>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
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
