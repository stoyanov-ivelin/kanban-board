import { ReactNode, Component } from "react";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import "components/NavBar/NavBar.css"
import { NavLink } from "react-router-dom";

class NavBar extends Component {
  render(): ReactNode {
    return (
      <AppBar position="relative" style={{ zIndex: 1201 }}>
        <Toolbar className="toolbar">
          <div className="top-left-menu">
            <NavLink className="nav-link" activeClassName="nav-link-active" to="/boards">Boards</NavLink>
            <NavLink className="nav-link" activeClassName="nav-link-active" to="/admin">Admin</NavLink>
          </div>
          <div className="top-right-menu">
            <Typography variant="h5">User Name</Typography>
            <AccountCircle className="account-icon" />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavBar;
