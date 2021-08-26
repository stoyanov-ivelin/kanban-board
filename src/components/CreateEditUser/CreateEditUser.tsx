import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "store/store";
import "components/Issue/CreateEditIssue/CreateEditIssue.css";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { IUser } from "common/models";
import EditIcon from "@material-ui/icons/Edit";
import { skillsConstant, userConstants } from "common/constants";
import "./CreateEditUser.css";

interface CreateEditUserState {
  open: boolean;
  isSubmitting: boolean;
  profilePicture: string;
  name: string;
  description: string;
  skills: Array<string>;
  charactersLeft: number;
  profilePictureError: string | null;
  nameError: string | null;
  descriptionError: string | null;
  skillsError: string | null;
}

interface CreateEditUserProps {
  users: Array<IUser>;
  user?: IUser;
  successAction: (user: any) => void;
  cancelAction: any;
  isEditing?: boolean;
}

class CreateEditUser extends Component<
  CreateEditUserProps,
  CreateEditUserState
> {
  constructor(props: CreateEditUserProps) {
    super(props);

    const { isEditing } = this.props;
    this.state = {
      open: false,
      isSubmitting: false,
      profilePicture: "",
      name: "",
      description: "",
      skills: [],
      charactersLeft: userConstants.descriptionMaxChars,
      profilePictureError: isEditing
        ? null
        : userConstants.profilePictureErrorMsg,
      nameError: isEditing ? null : userConstants.nameErrorMsg,
      descriptionError: isEditing ? null : userConstants.descriptionErrorMsg,
      skillsError: isEditing ? null : userConstants.skillsErrorMsg,
    };
  }

  componentDidMount() {
    if (this.props.isEditing && this.props.user) {
      const { profilePicture, name, description, skills } = this.props.user;
      this.setState({
        profilePicture,
        name,
        description,
        skills,
        charactersLeft: userConstants.descriptionMaxChars - description.length,
      });
    }
  }

  render(): JSX.Element {
    const {
      open,
      isSubmitting,
      profilePicture,
      name,
      description,
      skills,
      charactersLeft,
      profilePictureError,
      nameError,
      descriptionError,
      skillsError,
    } = this.state;

    const { isEditing } = this.props;

    return (
      <div>
        {isEditing ? (
          <IconButton
            color="primary"
            size="small"
            onClick={this.handleClickOpen}
          >
            <EditIcon fontSize="large" />
          </IconButton>
        ) : (
          <Button
            size="large"
            variant="contained"
            color="primary"
            startIcon={<AddBoxIcon />}
            onClick={this.handleClickOpen}
          >
            Add New User
          </Button>
        )}
        <Dialog open={open} onClose={this.handleClose} fullWidth>
          <DialogTitle classes={{ root: "dialog-title" }}>
            {isEditing ? "Edit User" : "Create User"}
          </DialogTitle>
          <DialogContent>
            <div className="input-title">Picture Url</div>
            <TextField
              onChange={this.handleUrlChange}
              defaultValue={profilePicture}
              fullWidth
              variant="outlined"
              margin="normal"
              name="Picture Url"
              placeholder="Enter a url..."
              helperText={isSubmitting && profilePictureError}
              error={isSubmitting && profilePictureError !== null}
            />
            <div className="input-title">Name</div>
            <TextField
              onChange={this.handleNameChange}
              defaultValue={name}
              fullWidth
              variant="outlined"
              margin="normal"
              name="Name"
              placeholder="Enter name..."
              helperText={isSubmitting && nameError}
              error={isSubmitting && nameError !== null}
            />
            <div className="input-title">Description</div>
            <TextField
              onChange={this.handleDescriptionChange}
              defaultValue={description}
              fullWidth
              multiline
              minRows={6}
              variant="outlined"
              margin="normal"
              name="name"
              placeholder="Enter description..."
              helperText={
                isSubmitting && descriptionError
                  ? descriptionError
                  : `Max ${userConstants.descriptionMaxChars} characters, ${charactersLeft} left`
              }
              error={isSubmitting && descriptionError !== null}
            />
            <List>
              {skillsConstant.map((skill, index) => (
                <ListItem
                  key={index}
                  className="list-item-skill"
                  dense
                  button
                  onClick={this.handleSkillsChange(skill)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={skills.indexOf(skill) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={skill} />
                </ListItem>
              ))}
            </List>
            {isSubmitting && skillsError !== null && (
              <p className="error-text">{skillsError}</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleSubmit = (): void => {
    const { profilePictureError, nameError, descriptionError, skillsError } =
      this.state;

    this.setState(
      {
        isSubmitting: true,
      },
      () => this.handleValidation()
    );

    const hasErrros =
      profilePictureError || nameError || descriptionError || skillsError;
    if (hasErrros) {
      return;
    }

    const { profilePicture, name, description, skills } = this.state;
    let id = 0;
    if (this.props.user) {
      id = this.props.user.id;
    }

    this.props.successAction({
      id,
      profilePicture,
      name,
      description,
      skills,
    });
    this.handleClose();
  };

  handleValidation = (): void => {
    this.handleUrlValidation();
    this.handleNameValidation();
    this.handleDescriptionValidation();
    this.handleSkillsValidation();
  };

  handleUrlValidation = (): void => {
    const { profilePicture: pictureUrl } = this.state;
    let isNotValid = false;
    try {
      new URL(pictureUrl);
    } catch {
      isNotValid = true;
    }

    this.setState({
      profilePictureError: isNotValid
        ? userConstants.profilePictureErrorMsg
        : null,
    });
  };

  handleNameValidation = (): void => {
    const { name } = this.state;
    const isNotValid = !name || name.length < 3 || name.length > 50;

    this.setState({
      nameError: isNotValid ? userConstants.nameErrorMsg : null,
    });
  };

  handleDescriptionValidation = (): void => {
    const { description } = this.state;
    const isNotValid =
      !description ||
      description.length < 3 ||
      description.length > userConstants.descriptionMaxChars;

    this.setState({
      descriptionError: isNotValid ? userConstants.descriptionErrorMsg : null,
    });
  };

  handleSkillsValidation = (): void => {
    const { skills } = this.state;
    const isNotValid = skills.length === 0;

    this.setState({
      skillsError: isNotValid ? userConstants.skillsErrorMsg : null,
    });
  };

  handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    this.setState({ profilePicture: value }, () => this.handleUrlValidation());
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    this.setState({ name: value }, () => this.handleNameValidation());
  };

  handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;

    this.setState(
      {
        description: value,
        charactersLeft: userConstants.descriptionMaxChars - value.length,
      },
      () => this.handleDescriptionValidation()
    );
  };

  handleSkillsChange = (value: string) => () => {
    const { skills } = this.state;
    const currentIndex = skills.indexOf(value);
    const newSkills = [...skills];

    if (currentIndex === -1) {
      newSkills.push(value);
    } else {
      newSkills.splice(currentIndex, 1);
    }

    this.setState(
      {
        skills: newSkills,
      },
      () => this.handleSkillsValidation()
    );
  };

  handleClose = (): void => {
    const { name, description, profilePicture: pictureUrl } = this.state;

    if (this.props.isEditing) {
      const stateAfterDialogClose = this.props.cancelAction(
        name,
        description,
        pictureUrl
      );
      this.setState(stateAfterDialogClose);
    } else {
      const stateAfterDialogClose = this.props.cancelAction();
      this.setState(stateAfterDialogClose);
    }
  };

  handleClickOpen = (): void => {
    this.setState({
      open: true,
    });
  };
}

const mapStateToProps = (state: RootState) => ({
  issues: state.issues,
  users: state.users,
});

export default connect(mapStateToProps)(CreateEditUser);
