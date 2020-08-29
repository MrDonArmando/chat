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
  const [name, setName] = useState("donek");
  const [email, setEmail] = useState("dominik1@onet.com.pl");
  const [password, setPassword] = useState("dupadupa");
  const [passwordConfirmation, setPasswordConfirmation] = useState("dupadupa");

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
          <legend>Sign up</legend>

          <label htmlFor="register-form-name">Nazwa użytkownika</label>
          <input
            type="text"
            id="register-form-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="register-form-email">Email</label>
          <input
            type="text"
            id="register-form-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="register-form-password">Hasło</label>
          <input
            type="password"
            id="register-form-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="register-form-password-confirmation">
            Potwierdź hasło
          </label>
          <input
            type="password"
            id="register-form-password-confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button>Zarejestruj się</button>
        </fieldset>
      </form>
      <Link to="/login">Already have an account? Sign in here!</Link>
    </div>
  );
};

export default Register;
