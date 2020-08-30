import React, { useState, useEffect } from "react";
import "./index.scss";

const FriendInfo = ({ profilesDataOfChosenFriend }) => {
  if (!profilesDataOfChosenFriend) return null;

  const { avatarURL, displayName } = profilesDataOfChosenFriend;

  return (
    <div id="flex-info-container">
      <div id="friend-avatar-container">
        <img
          src={
            avatarURL
              ? avatarURL
              : require("../../../../images/default_profile_picture.jpg")
          }
          alt=""
          id="friend-avatar"
        />
        <span id="friend-name">{displayName}</span>
      </div>
    </div>
  );
};

export default FriendInfo;
