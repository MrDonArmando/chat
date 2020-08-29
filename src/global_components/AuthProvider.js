import React, { useEffect, useState, useRef } from "react";
import firebase from "./firebase";

export const AuthContext = React.createContext({ currentUser: null });

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    firebase.auth.onAuthStateChanged((user) => {
      //console.log("onAuthStateChanged: ", user.uid);

      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if (pending) {
    return <>Loading...</>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
