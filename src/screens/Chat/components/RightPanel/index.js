import React from "react";
import "./index.scss";
import Settings from "../Settings";
import FriendInfo from "../FriendInfo";
import firebase from "../../../../global_components/firebase";
import { useHistory } from "react-router-dom";

const RightPanel = ({ profilesDataOfChosenFriend }) => {
  const history = useHistory();

  const logout = () => {
    firebase
      .logout()
      .then((res) => {
        history.replace("/login");
      })
      .catch((err) => console.log("ERROR IN SIGNOUT: ", err));
  };

  return (
    <div id="right-panel-container">
      <Settings />
      <FriendInfo profilesDataOfChosenFriend={profilesDataOfChosenFriend} />
      <button id="button-logout" onClick={logout}>
        Log out
      </button>
    </div>
  );
};

export default RightPanel;
