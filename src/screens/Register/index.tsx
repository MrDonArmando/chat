import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useContext,
} from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import "./index.scss";
import firebase from "../../global_components/firebase";
import { AuthContext } from "../../global_components/AuthProvider";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const history = useHistory();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    firebase
      .register(name, email, password)
      .then((res) => {
        history.push("/login");
      })
      .catch((err) => console.log("REGISTER ERR: ", err));
  };

  return (
    <div id="register-container">
      <form id="register-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>
            Welcome to{" "}
            <span className="register-text-highlight">Messenger</span>
          </legend>
          <input
            type="text"
            id="register-form-name"
            className="register-input"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            id="register-form-email"
            className="register-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="register-form-password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            id="register-form-password-confirmation"
            placeholder="Password confirmation"
            className="register-input"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button id="register-submit-button">Sign up</button>

          <div id="register-bottom-container">
            <span> Already have an account?</span>

            <Link id="register-bottom-container__link" to="/login">
              Sign in here!
            </Link>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Register;
