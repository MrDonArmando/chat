import React, { useEffect, useState } from "react";
import "./index.scss";
import ContactList from "./components/ContactList";
import FriendInfo from "./components/FriendInfo";
import firebase from "../../global_components/firebase";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Messages from "./components/Messages";
import MessageForm from "./components/MessageForm";
import { useDispatch } from "react-redux";
import { fetch10PreviousMessages } from "../../redux/chat/actions";
import { Switch, Route } from "react-router-dom";

interface Friend {
  id: string;
  displayName: string;
}

const Chat = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [friendsInfo, setFriendsInfo] = useState<Friend[]>([]);

  useEffect(() => {
    const getFriendsInfo = async () => {
      try {
        const currentUserUID = firebase.getMyUID();
        const querySnapshot = await firebase.getUsers();

        const usersInfo = querySnapshot.docs.map((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const displayName = doc.data().displayName;
          const { id } = doc;

          return { displayName, id };
        });

        const friendsInfo = usersInfo.filter(({ id }) => id !== currentUserUID);

        setFriendsInfo(friendsInfo);
      } catch (err) {
        console.log("ERROR IN getFriendsInfo: ", err);
      }
    };

    getFriendsInfo();
  }, []);

  const pathName = useLocation().pathname;
  if (pathName === "/chat" && friendsInfo.length)
    history.replace(`/chat/${friendsInfo[0].id}`);

  return (
    <div className="container-screen">
      {/* <button onClick={getData}>Get users</button>
 
      <button onClick={getUserInfo}>Get user info</button> */}
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
