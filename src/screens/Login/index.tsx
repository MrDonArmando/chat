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
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Sign up</legend>

          <label htmlFor="login-form-email">Email</label>
          <input
            type="text"
            id="login-form-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="login-form-password">Hasło</label>
          <input
            type="password"
            id="login-form-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Sign in</button>
        </fieldset>
      </form>
      <Link to="/register">Don't have an account yet? Sign up!</Link>
    </div>
  );
};

export default Login;
