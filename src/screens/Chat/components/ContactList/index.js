import React, { useState, useEffect } from "react";
import "./index.scss";
import { Link } from "react-router-dom";

const ContactList = ({ friendsInfo }) => {
  const [currentFriend, setCurrentFriend] = useState(0);

  useEffect(() => {
    //console.log("FRIENDS: ", friendsInfo);
  }, [friendsInfo]);

  return (
    <div id="contact-list-container">
      {friendsInfo.map(({ displayName, userID, avatarURL }, index) => {
        const isCurrent = currentFriend === index;

        return (
          <li
            onClick={() => setCurrentFriend(index)}
            className={`list-item ${isCurrent && "list-item--current"}`}
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
