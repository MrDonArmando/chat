import React, { useContext } from "react";
import firebase from "./firebase";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PublicRoute = ({ children, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? (
    <Redirect to="/chat" />
  ) : (
    <Route {...rest}>{children}</Route>
  );
};

export default PublicRoute;
