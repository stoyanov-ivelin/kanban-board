import { Component } from "react";
import { IUser } from "common/models";
import { AppDispatch } from "store/store";
import { connect } from "react-redux";
import CreateEditUser from "components/CreateEditUser/CreateEditUser";
import { editUser } from "common/actions";

interface EditUserProps {
  dispatch: AppDispatch;
  user: IUser;
}

class EditUser extends Component<EditUserProps> {
  render() {
    return (
      <CreateEditUser
        user={this.props.user}
        successAction={this.handleSubmit}
        isEditing={true}
      ></CreateEditUser>
    );
  }

  handleSubmit = async (user: IUser): Promise<void> => {
    const { id, profilePicture, jobPosition, name, description, skills } = user;
    this.props.dispatch(
      editUser({ id, profilePicture, jobPosition, name, description, skills })
    );
  };
}

export default connect()(EditUser);
