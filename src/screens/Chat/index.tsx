import React, { useEffect, useState } from "react";
import "./index.scss";
import ContactList from "./components/ContactList";
import FriendInfo from "./components/FriendInfo";
import firebase from "../../global_components/firebase";
import { useHistory, useLocation } from "react-router-dom";
import Messages from "./components/Messages";
import MessageForm from "./components/MessageForm";
import { Switch, Route } from "react-router-dom";

interface Friend {
  userID: string;
  displayName: string;
  avatarURL: URL;
}

const Chat = () => {
  const history = useHistory();
  const [friendsInfo, setFriendsInfo] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchUsersProfilesData = async () => {
      try {
        const currentUserUID = firebase.getMyUID();
        const usersProfilesData = await firebase.getUsersProfilesData();
        console.log("usersProfileData: ", usersProfilesData);

        const friendsProfilesData = usersProfilesData.filter(
          ({ userID }) => userID !== currentUserUID
        );

        setFriendsInfo(friendsProfilesData);
      } catch (err) {
        console.log("ERROR IN fetchUsersProfilesData: ", err);
      }
    };

    fetchUsersProfilesData();
  }, []);

  const pathName = useLocation().pathname;
  if (pathName === "/chat" && friendsInfo.length)
    history.replace(`/chat/${friendsInfo[0].userID}`);

  return (
    <div className="container-screen">
      <ContactList friendsInfo={friendsInfo} />
      <div id="container-chat">
        <Switch>
          <Route
            path={`/chat/:friendID`}
            render={(props) => (
              <>
                <Messages friendID={props.match.params.friendID} />
                <MessageForm friendID={props.match.params.friendID} />
              </>
            )}
          />
        </Switch>
      </div>
      <FriendInfo friendName="Donek" />
    </div>
  );
};

export default Chat;
