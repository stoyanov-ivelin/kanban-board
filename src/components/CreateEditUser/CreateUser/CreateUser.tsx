import { createUser } from "common/actions";
import { userConstants } from "common/constants";
import { IUser } from "common/models";
import CreateEditUser from "components/CreateEditUser/CreateEditUser";
import { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch } from "store/store";

interface ICLoseCreateUserDialog {
  open: boolean;
  isSubmitting: boolean;
  profilePictureError: null;
  nameError: null;
  descriptionError: null;
  skillsError: null;
  charactersLeft: number;
  profilePicture: string;
  name: string;
  description: string;
  skills: Array<string>;
}

interface CreateUserProps {
  dispatch: AppDispatch;
}

class CreateUser extends Component<CreateUserProps> {
  render() {
    return (
      <CreateEditUser
        successAction={this.handleSubmit}
        cancelAction={this.handleClose}
      />
    );
  }

  handleSubmit = (user: IUser): void => {
    const { profilePicture, name, description, skills } = user;
    this.props.dispatch(
      createUser({ profilePicture, name, description, skills })
    );
  };

  handleClose = (): ICLoseCreateUserDialog => {
    return {
      open: false,
      isSubmitting: false,
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
  };
}

export default connect()(CreateUser);
