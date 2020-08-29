import React, { useState, useEffect, useContext, FormEvent } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { AuthContext } from "../../global_components/AuthProvider";
import "./index.scss";
import firebase from "../../global_components/firebase";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("dominik5@onet.com.pl");
  const [password, setPassword] = useState("dupadupa");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    firebase
      .login(email, password)
      .then(({ user }) => {
        if (user) {
        }
        history.replace("/chat");
      })
      .catch((err) => console.log("ERR: ", err));
  };

  return (
    <div id="login-container">
      <form onSubmit={handleSubmit} id="login-form">
        <fieldset>
          <legend>
            Welcome to <span className="login-text-highlight">Messengera</span>
          </legend>

          <div className="container-row">
            <button className="button-auth-provider">Google</button>
            <button className="button-auth-provider">Facebook</button>
          </div>

          <input
            type="email"
            name="email"
            id="login-input-email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            type="password"
            name="password"
            id="login-input-password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button id="login-submit-button">Sign in</button>
          <div id="register-bottom-container">
            <span> Don't have an account yet?</span>

            <Link id="register-bottom-container__link" to="/register">
              Sign up here!
            </Link>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
