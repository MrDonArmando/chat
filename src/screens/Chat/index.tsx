import React, { useEffect, useState } from "react";
import "./index.scss";
import ContactList from "./components/ContactList";
import RightPanel from "./components/RightPanel";
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
  const [friendsProfilesData, setFriendsProfilesData] = useState<Friend[]>([]);
  const [indexOfChosenFriend, setIndexOfChosenFriend] = useState(0);

  useEffect(() => {
    const fetchUsersProfilesData = async () => {
      try {
        const currentUserUID = firebase.getMyUID();
        const usersProfilesData = await firebase.getUsersProfilesData();

        const friendsProfilesData = usersProfilesData.filter(
          ({ userID }) => userID !== currentUserUID
        );

        setFriendsProfilesData(friendsProfilesData);
      } catch (err) {
        console.log("ERROR IN fetchUsersProfilesData: ", err);
      }
    };

    fetchUsersProfilesData();
  }, []);

  const pathName = useLocation().pathname;
  if (pathName === "/chat" && friendsProfilesData.length)
    history.replace(`/chat/${friendsProfilesData[0].userID}`);

  return (
    <div className="container-screen">
      <ContactList
        friendsProfilesData={friendsProfilesData}
        indexOfChosenFriend={indexOfChosenFriend}
        setIndexOfChosenFriend={setIndexOfChosenFriend}
      />
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
      <RightPanel
        profilesDataOfChosenFriend={friendsProfilesData[indexOfChosenFriend]}
      />
    </div>
  );
};

export default Chat;
