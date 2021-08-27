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
import { Skills } from "common/constants";
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
                const skillsWithImgProp = Object.values(Skills);
                const imgUrl = skillsWithImgProp.find((skillWithImg) => skillWithImg.name === skill)?.img;
                
                return (
                  <List dense key={index}>
                    {index < 3 && (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={imgUrl} />
                        </ListItemAvatar>
                        {skill}
                      </ListItem>
                    )}
                    {index === 3 && (
                      <Tooltip arrow title={skills.slice(3).join(", ")}>
                        <div>... {skills.length - 3} more</div>
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
