import { createUser } from "common/actions";
import { IUser } from "common/models";
import CreateEditUser from "components/CreateEditUser/CreateEditUser";
import { Component } from "react";
import { connect } from "react-redux";
import { AppDispatch } from "store/store";

interface CreateUserProps {
  dispatch: AppDispatch;
}

class CreateUser extends Component<CreateUserProps> {
  render() {
    return (
      <CreateEditUser
        successAction={this.handleSubmit}
      />
    );
  }

  handleSubmit = (user: IUser): void => {
    const { profilePicture, name, description, skills } = user;
    this.props.dispatch(
      createUser({ profilePicture, name, description, skills })
    );
  };
}

export default connect()(CreateUser);
