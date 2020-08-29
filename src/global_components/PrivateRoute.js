import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = ({ children, ...rest }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? (
    <Route {...rest}>{children}</Route>
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
