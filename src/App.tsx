import "App.css";
import NavBar from "components/NavBar/NavBar";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Boards from "components/Boards/Boards";
import AdminHome from "components/AdminHome/AdminHome";
import Users from "components/Users/Users";
import SideNav from "components/SideNav/SideNav";

const App = () => {
  const location = useLocation();
  const shouldRenderSideNav = location.pathname.includes("admin");

  return (
    <div className="App">
      <NavBar />
      {shouldRenderSideNav && <SideNav />}
      <Switch>
        <Redirect path="/" exact to="/boards" />
        <Route path="/boards" component={Boards} />
        <Route exact path="/admin" component={AdminHome} />
        <Route path="/admin/users" component={Users} />
      </Switch>
    </div>
  );
};

export default App;
