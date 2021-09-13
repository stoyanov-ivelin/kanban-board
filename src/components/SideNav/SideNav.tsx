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
  adminPanelLink: {
    fontSize: "20px",
    marginTop: "20px",
  }
});

export default function SideNav(): JSX.Element {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      classes={{ paper: classes.paper, root: classes.drawer }}
    >
      <Toolbar />
      <div>
        <List>
          {AdminPanelLinks.map((link, index) => (
            <ListItem
              button
              key={index}
              classes={{ root: classes.adminPanelLink}}
              className="nav-link"
              activeClassName="nav-link-active"
              component={NavLink}
              to={`/admin/${link.url}`}
            >
              {link.title}
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
