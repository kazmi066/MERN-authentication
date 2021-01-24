import Button from "@material-ui/core/Button";
import { Link, Redirect } from "react-router-dom";
import "./Navbar.css";
import Container from "../Container/Container";
import Loading from "../Loading";
import { useContext } from "react";
import { MainContext } from "../../context";
import { Box } from "@material-ui/core";

export default function Navbar() {
  const { user, loggedInUser, setUser, signOutUser } = useContext(MainContext);

  const logout = () => {
    signOutUser();
    setUser([]);
  };
  return (
    <>
      <header>
        <Container>
          <nav>
            <div className="logo">
              <h1>
                <Link className="link" to="/">
                  jwt-frontend
                </Link>
              </h1>
            </div>
            <div className="nav-links">
              <ul className="links">
                <li>
                  <Link className="link" to="/about">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="link" to="/projects">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link className="link" to="/protected">
                    protected
                  </Link>
                </li>
              </ul>
            </div>
            {user.loggedIn ? (
              <Box className="loggedin">
                <h3>{loggedInUser}</h3>
                <div className="btn-2">
                  <Button variant="outlined" color="secondary" onClick={logout}>
                    <Link to={"/"} onClick={() => localStorage.clear()}>
                      logout
                    </Link>
                  </Button>
                </div>
                <Redirect to={"/"} />
              </Box>
            ) : (
              <div className="sign-buttons">
                <div className="btn-1">
                  <Button variant="outlined" color="primary">
                    <Link to="/signin">Sign In</Link>
                  </Button>
                </div>
                <div className="btn-2">
                  <Button variant="outlined" color="secondary">
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            )}
          </nav>
        </Container>
      </header>
      {loading ? <Loading /> : ""}
    </>
  );
}
