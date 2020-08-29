import React, { useState, useEffect } from "react";
import "./index.scss";
import { Link } from "react-router-dom";

const ContactList = ({ friendsInfo }) => {
  const [currentFriend, setChosenFriend] = useState(0);

  useEffect(() => {
    //console.log("FRIENDS: ", friendsInfo);
  }, [friendsInfo]);

  return (
    <div id="contact-list-container">
      {friendsInfo.map(({ displayName, id }, index) => {
        const isCurrent = currentFriend === index;

        return (
          <li
            onClick={() => setChosenFriend(index)}
            className={`list-item ${isCurrent && "list-item--current"}`}
            key={id}
          >
            <Link to={`/chat/${id}`} className="list-item__link">
              <img
                src={require("../../../../images/default_profile_picture.jpg")}
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
