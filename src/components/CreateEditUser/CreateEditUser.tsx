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
  InputLabel,
} from "@material-ui/core";
import React, { Component } from "react";
import "components/Issue/CreateEditIssue/CreateEditIssue.css";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { ISkill, IUser } from "common/models";
import EditIcon from "@material-ui/icons/Edit";
import { Skills, userConstants } from "common/constants";
import "./CreateEditUser.css";

interface CreateEditUserState {
  open: boolean;
  profilePicture: string;
  name: string;
  description: string;
  skills: Array<ISkill>;
  charactersLeft: number;
  profilePictureError: string | null;
  nameError: string | null;
  descriptionError: string | null;
  skillsError: string | null;
}

interface CreateEditUserProps {
  user?: IUser;
  successAction: (user: IUser) => Promise<void>;
  isEditing?: boolean;
}

class CreateEditUser extends Component<
  CreateEditUserProps,
  CreateEditUserState
> {
  constructor(props: CreateEditUserProps) {
    super(props);

    this.state = {
      open: false,
      profilePicture: "",
      name: "",
      description: "",
      skills: [],
      charactersLeft: userConstants.descriptionMaxChars,
      profilePictureError: null,
      nameError: null,
      descriptionError: null,
      skillsError: null,
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
    return (
      <div>
        {this.renderButton()}
        {this.renderDialog()}
      </div>
    );
  }

  renderButton(): JSX.Element {
    return (
      <>
        {this.props.isEditing ? (
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
      </>
    );
  }

  renderDialog(): JSX.Element {
    return (
      <Dialog open={this.state.open} onClose={this.handleClose} fullWidth>
        <DialogTitle classes={{ root: "dialog-title" }}>
          {this.props.isEditing ? "Edit User" : "Create User"}
        </DialogTitle>
        <DialogContent>
          {this.renderProfilePictureField()}
          {this.renderNameField()}
          {this.renderDescriptionField()}
          {this.renderSkillsCheckboxSelect()}
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
    );
  }

  renderProfilePictureField(): JSX.Element {
    const { profilePicture, profilePictureError } = this.state;

    return (
      <>
        <InputLabel className="input-title" htmlFor="profile-picture" required>
          Picture Url
        </InputLabel>
        <TextField
          onChange={this.handleUrlChange}
          defaultValue={profilePicture}
          fullWidth
          variant="outlined"
          margin="normal"
          id="profile-picture"
          placeholder="Enter a url..."
          helperText={profilePictureError}
          error={profilePictureError !== null}
        />
      </>
    );
  }

  renderNameField(): JSX.Element {
    const { name, nameError } = this.state;

    return (
      <>
        <InputLabel className="input-title" htmlFor="name" required>
          Name
        </InputLabel>
        <TextField
          onChange={this.handleNameChange}
          defaultValue={name}
          fullWidth
          variant="outlined"
          margin="normal"
          id="name"
          placeholder="Enter name..."
          helperText={nameError}
          error={nameError !== null}
        />
      </>
    );
  }

  renderDescriptionField(): JSX.Element {
    const { description, descriptionError, charactersLeft } = this.state;

    return (
      <>
        <InputLabel className="input-title" htmlFor="description" required>
          Description
        </InputLabel>
        <TextField
          onChange={this.handleDescriptionChange}
          defaultValue={description}
          fullWidth
          multiline
          minRows={6}
          variant="outlined"
          margin="normal"
          id="description"
          placeholder="Enter description..."
          helperText={
            descriptionError
              ? descriptionError
              : `Max ${userConstants.descriptionMaxChars} characters, ${charactersLeft} left`
          }
          error={descriptionError !== null}
        />
      </>
    );
  }

  renderSkillsCheckboxSelect(): JSX.Element {
    const { skills, skillsError } = this.state;

    return (
      <List>
        {Object.entries(Skills).map(([key, value], index) => (
          <ListItem
            key={index}
            className="list-item-skill"
            dense
            button
            onClick={this.handleSkillsChange(value)}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={skills.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={key} />
          </ListItem>
        ))}
        {skillsError && <p className="error-text">{skillsError}</p>}
      </List>
    );
  }

  handleSubmit = async (): Promise<void> => {
    const hasErrors = !this.handleValidation();
    if (hasErrors) {
      return;
    }

    const { profilePicture, name, description, skills } = this.state;
    let id = 0;
    if (this.props.user) {
      id = this.props.user.id;
    }

    await this.props.successAction({
      id,
      profilePicture,
      jobPosition: "Software Developer",
      name,
      description,
      skills,
    });
    this.handleClose();
  };

  handleValidation = (): boolean => {
    const hasUrlError = this.handleUrlValidation();
    const hasNameError = this.handleNameValidation();
    const hasDescriptionError = this.handleDescriptionValidation();
    const hasSkillsError = this.handleSkillsValidation();

    if (hasUrlError || hasNameError || hasDescriptionError || hasSkillsError) {
      return false;
    }

    return true;
  };

  handleUrlValidation = (): boolean => {
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

    return isNotValid;
  };

  handleNameValidation = (): boolean => {
    const { name } = this.state;
    const isNotValid = !name || name.length < 3 || name.length > 50;

    this.setState({
      nameError: isNotValid ? userConstants.nameErrorMsg : null,
    });

    return isNotValid;
  };

  handleDescriptionValidation = (): boolean => {
    const { description } = this.state;
    const isNotValid =
      !description ||
      description.length < 3 ||
      description.length > userConstants.descriptionMaxChars;

    this.setState({
      descriptionError: isNotValid ? userConstants.descriptionErrorMsg : null,
    });

    return isNotValid;
  };

  handleSkillsValidation = (): boolean => {
    const { skills } = this.state;
    const isNotValid = skills.length === 0;

    this.setState({
      skillsError: isNotValid ? userConstants.skillsErrorMsg : null,
    });

    return isNotValid;
  };

  handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    this.setState({ profilePicture: value, profilePictureError: null });
  };

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;

    this.setState({ name: value, nameError: null });
  };

  handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { value } = event.target;

    this.setState({
      description: value,
      charactersLeft: userConstants.descriptionMaxChars - value.length,
      descriptionError: null,
    });
  };

  handleSkillsChange = (value: ISkill) => () => {
    const { skills } = this.state;
    const currentIndex = skills.indexOf(value);
    const newSkills = [...skills];

    if (currentIndex === -1) {
      newSkills.push(value);
    } else {
      newSkills.splice(currentIndex, 1);
    }

    this.setState({
      skills: newSkills,
      skillsError: null,
    });
  };

  handleClose = (): void => {
    if (this.props.isEditing) {
      this.handleEditDialogClose();
    } else {
      this.handleCreateDialogClose();
    }
  };

  handleCreateDialogClose = (): void => {
    const stateAfterDialogClose = {
      open: false,
      profilePictureError: null,
      nameError: null,
      descriptionError: null,
      skillsError: null,
      charactersLeft: userConstants.descriptionMaxChars,
      profilePicture: "",
      name: "",
      description: "",
      skills: [],
    };

    this.setState(stateAfterDialogClose);
  };

  handleEditDialogClose = (): void => {
    const { profilePicture, name, description, skills } = this.props.user!;

    const stateAfterDialogClose = {
      open: false,
      profilePictureError: null,
      nameError: null,
      descriptionError: null,
      skillsError: null,
      charactersLeft: userConstants.descriptionMaxChars - description.length,
      profilePicture,
      name,
      description,
      skills,
    };

    this.setState(stateAfterDialogClose);
  };

  handleClickOpen = (): void => {
    this.setState({
      open: true,
    });
  };
}

export default CreateEditUser;
