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
import { Component } from "react";
import "./User.css";

interface UsersProps {
  user: IUser;
}

class User extends Component<UsersProps> {
  render() {
    const { id, profilePicture, name, jobPosition, description, skills } =
      this.props.user;

    const skillsLimit = 3;

    return (
        <Grid item key={id} xs={4}>
          <Card variant="outlined" className="user-card">
            <CardHeader
              className="user-card-header"
              avatar={<Avatar src={profilePicture} />}
              title={name}
              subheader={jobPosition}
            />
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
                      <Tooltip arrow title={skills.slice(skillsLimit).map(skill => skill.name).join(", ")}>
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
}

export default User;
