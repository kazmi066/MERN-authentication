import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

const MainContext = React.createContext();
axios.defaults.withCredentials = true;
axios.defaults.headers.common["x-access-token"] = localStorage.getItem("token");

const UserProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState([]);
  const [loggedInUser, setloggedInUser] = useState("");

  const registerUser = async (data) => {
    await axios
      .post("api/user/register", data)
      .then((res) => {
        setMessage(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const signInUser = async (data) => {
    await axios
      .post("api/user/login", data)
      .then((res) => {
        if (res.data.auth) {
          setUser(res.data.theUser);
          localStorage.setItem("token", res.data.token);
        } else {
          setMessage(res.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const signOutUser = async () => {
    axios
      .get("/api/user/logout")
      .then(() => console.log("User logged OUt"))
      .catch((e) => console.log(e));
  };

  const checkIfAuthenticated = async () => {
    await axios
      .get("api/user/posts")
      .then((res) => console.log(res))
      .catch((err) => console.log("Error :", err));
  };

  useEffect(() => {
    axios
      .get("api/user/login")
      .then((res) => {
        setUser(res.data);
        if (res.data.loggedIn === true) {
          setloggedInUser(res.data.user.username);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <MainContext.Provider
      value={{
        registerUser,
        message,
        setMessage,
        signInUser,
        user,
        loggedInUser,
        checkIfAuthenticated,
        signOutUser,
        setUser,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export { MainContext, UserProvider };
