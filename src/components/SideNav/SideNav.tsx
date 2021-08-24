import { Drawer, Toolbar, List, ListItem, makeStyles } from "@material-ui/core";
import { AdminPanelLinks } from "common/constants";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles({
  drawer: {
    width: "240px",
    flexShrink: 0,
  },
  paper: {
    width: "240px",
    background: "lightgrey",
  },
});

export default function SideNav(): JSX.Element {
  const classes = useStyles();

  return (
    <Drawer
      className="drawer"
      variant="permanent"
      classes={{ paper: classes.paper }}
    >
      <Toolbar />
      <div>
        <List>
          {AdminPanelLinks.map((link) => (
            <ListItem
              button
              className="nav-link"
              activeClassName="nav-link-active"
              style={{ fontSize: "20px", marginTop: "20px " }}
              component={NavLink}
              to={`/admin/${link.toLocaleLowerCase()}`}
            >
              {link}
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
