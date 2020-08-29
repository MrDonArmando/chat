import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import PrivateRoute from "./global_components/PrivateRoute";
import Login from "./screens/Login/index.tsx";
import Chat from "./screens/Chat/index.tsx";
import Register from "./screens/Register/index.tsx";
import AuthProvider from "./global_components/AuthProvider";
import PublicRoute from "./global_components/PublicRoute";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Switch>
            <Redirect exact from="/" to="/chat" />
            <PublicRoute path="/login">
              <Login />
            </PublicRoute>
            <PublicRoute path="/register">
              <Register />
            </PublicRoute>
            <PrivateRoute path="/chat">
              <Chat />
            </PrivateRoute>
          </Switch>
        </Router>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
