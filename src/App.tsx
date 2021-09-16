import "App.css";
import NavBar from "components/NavBar/NavBar";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Boards from "components/Boards/Boards";
import AdminHome from "components/AdminHome/AdminHome";
import Users from "components/Users/Users";
import SideNav from "components/SideNav/SideNav";
import IssueConfig from "components/IssueConfig/IssueConfig";
import BoardsConfig from "components/BoardsConfig/BoardsConfig";
import { Grid } from "@material-ui/core";

const App = () => {
  const location = useLocation();
  const shouldRenderSideNav = location.pathname.includes("admin");

  return (
    <div className="App">
      <NavBar />
      <Grid container>
        <Grid item xs={2}>
      {shouldRenderSideNav && <SideNav />}
      </Grid>
      <Grid item xs={shouldRenderSideNav ? 7 : 12}>
      <Switch>
        <Redirect path="/" exact to="/boards" />
        <Route path="/boards" component={Boards} />
        <Route exact path="/admin" component={AdminHome} />
        <Route path="/admin/users" component={Users} />
        <Route path="/admin/issue-config" component={IssueConfig} />
        <Route path="/admin/boards" component={BoardsConfig} />
      </Switch>
      </Grid>
      </Grid>
    </div>
  );
};

export default App;
