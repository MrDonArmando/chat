import React from "react";
import "./index.scss";
import Settings from "../Settings";
import FriendInfo from "../FriendInfo";

const RightPanel = ({ profilesDataOfChosenFriend }) => {
  // const logout = () => {
  //   firebase
  //     .logout()
  //     .then((res) => {
  //       history.replace("/login");
  //     })
  //     .catch((err) => console.log("ERROR IN SIGNOUT: ", err));
  // };

  return (
    <div id="right-panel-container">
      <Settings />
      <FriendInfo profilesDataOfChosenFriend={profilesDataOfChosenFriend} />
    </div>
  );
};

export default RightPanel;
