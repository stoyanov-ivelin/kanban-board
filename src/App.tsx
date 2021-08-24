import { Component, ReactNode } from "react";
import "App.css";
import NavBar from "components/NavBar/NavBar";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Boards from "components/Boards/Boards";
import AdminHome from "components/AdminHome/AdminHome";
import Users from "components/Users/Users";

class App extends Component {
  render(): ReactNode {
    return (
      <div className="App">
        <BrowserRouter>
          <NavBar />
          <Switch>
            <Redirect path="/" exact to="/boards" />
            <Route path="/boards" component={Boards} />
            <Route exact path="/admin" component={AdminHome} />
            <Route path="/admin/users" component={Users} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
