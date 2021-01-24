import React, { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import { About, SignIn, SignUp } from "./pages";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { MainContext } from "./context";

function App() {
  const { user } = useContext(MainContext);
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            {user.loggedIn ? <Redirect to="/about" /> : <SignIn />}
          </Route>
          <Route path="/about" component={About} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
