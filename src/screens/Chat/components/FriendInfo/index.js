import React from "react";
import "./index.scss";

import Settings from "../Settings";

const FriendInfo = ({ friendName }) => {
  // const logout = () => {
  //   firebase
  //     .logout()
  //     .then((res) => {
  //       history.replace("/login");
  //     })
  //     .catch((err) => console.log("ERROR IN SIGNOUT: ", err));
  // };

  return (
    <div id="friend-info-container">
      <Settings />
    </div>
  );
};

export default FriendInfo;
