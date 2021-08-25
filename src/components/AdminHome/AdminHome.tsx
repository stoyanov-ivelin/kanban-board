import { Container, Grid, Typography, Button } from "@material-ui/core";
import { AdminPanelLinks } from "common/constants";
import "components/AdminHome/AdminHome.css";
import SideNav from "components/SideNav/SideNav";
import { NavLink } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="admin-home">
      <SideNav />
      <Container>
        <Typography variant="h3" style={{ margin: "100px" }}>
          Administration Panel
        </Typography>
        <Grid container spacing={8}>
          {AdminPanelLinks.map((link, index) => (
            <Grid item key={index} xs={6}>
              <Button
                component={NavLink}
                to={`/admin/${link.toLocaleLowerCase()}`}
                fullWidth
                variant="outlined"
                classes={{ label: "admin-nav-button"}}
                style={{borderWidth: "5px"}}
              >
                {link}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default AdminHome;
