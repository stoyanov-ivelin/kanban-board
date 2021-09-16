import { Grid, Typography, Button } from "@material-ui/core";
import { AdminPanelLinks } from "common/constants";
import { NavLink } from "react-router-dom";
import "components/AdminHome/AdminHome.css";

const AdminHome = () => {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h3" className="admin-home-heading">
          Administration Panel
        </Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={8}>
          {AdminPanelLinks.map((link, index) => (
            <Grid item key={index} xs={6}>
              <Button
                component={NavLink}
                to={`/admin/${link.url}`}
                fullWidth
                variant="outlined"
                className="admin-nav-button"
              >
                {link.title}
              </Button>
            </Grid>
          ))}
          </Grid>
        </Grid>
      </Grid>
  );
};

export default AdminHome;
