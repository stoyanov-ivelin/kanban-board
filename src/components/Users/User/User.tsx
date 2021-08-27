import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { IUser } from "common/models";
import EditUser from "components/CreateEditUser/EditUser/EditUser";
import { Component } from "react";
import "./User.css";

interface UserProps {
  user: IUser;
}

interface UserState {
  showEditButton: boolean;
}

class User extends Component<UserProps, UserState> {
  constructor(props: UserProps) {
    super(props);

    this.state = {
      showEditButton: false,
    };
  }
  render() {
    const { id, profilePicture, name, jobPosition, description, skills } =
      this.props.user;

    const skillsLimit = 3;

    return (
      <Grid item key={id} xs={4}>
        <Card
          variant="outlined"
          className="user-card"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div className="user-card-header">
            <CardHeader
              avatar={<Avatar src={profilePicture} />}
              title={name}
              subheader={jobPosition}
            />
            {this.state.showEditButton && <EditUser user={this.props.user} />}
          </div>
          <CardContent>
            <Tooltip arrow title={description}>
              <Typography
                variant="body2"
                color="textPrimary"
                className="tooltip"
              >
                {description}
              </Typography>
            </Tooltip>
            {skills.map((skill, index) => {
              return (
                <List dense key={index}>
                  {index < skillsLimit && (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={skill.img} />
                      </ListItemAvatar>
                      {skill.name}
                    </ListItem>
                  )}
                  {index === skillsLimit && (
                    <Tooltip
                      arrow
                      title={skills
                        .slice(skillsLimit)
                        .map((skill) => skill.name)
                        .join(", ")}
                    >
                      <div>... {skills.length - skillsLimit} more</div>
                    </Tooltip>
                  )}
                </List>
              );
            })}
          </CardContent>
        </Card>
      </Grid>
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
}

export default User;
