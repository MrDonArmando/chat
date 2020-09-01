import React from "react";
import "./index.scss";
import { Link } from "react-router-dom";
import firebase from "../../../../global_components/firebase";

const ContactList = ({
  friendsProfilesData,
  indexOfChosenFriend,
  setIndexOfChosenFriend,
}) => {
  const handleClick = async (index, userID) => {
    setIndexOfChosenFriend(index);
    firebase.createChat(userID);
  };

  return (
    <div id="contact-list-container">
      {friendsProfilesData.map(({ displayName, userID, avatarURL }, index) => {
        const isChosenFriend = indexOfChosenFriend === index;

        return (
          <li
            onClick={() => handleClick(index, userID)}
            className={`list-item ${isChosenFriend && "list-item--current"}`}
            key={userID}
          >
            <Link to={`/chat/${userID}`} className="list-item__link">
              <img
                src={
                  avatarURL
                    ? avatarURL
                    : require("../../../../images/default_profile_picture.jpg")
                }
                alt="Profile picture"
                className="list-item__avatar"
                width="50"
                height="50"
              />
              {displayName}
            </Link>
          </li>
        );
      })}
    </div>
  );
};

export default ContactList;
