import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDus1I-dkUE4CtOZNlpt8ZKXL5pl1FZ0Mw",
  authDomain: "saper-ce3aa.firebaseapp.com",
  databaseURL: "https://saper-ce3aa.firebaseio.com",
  projectId: "saper-ce3aa",
  storageBucket: "saper-ce3aa.appspot.com",
  messagingSenderId: "320043537840",
  appId: "1:320043537840:web:3d6e8c76ea84c5aa7bb275",
  measurementId: "G-GZT12414FL",
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.storageRef = firebase.storage().ref();
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async register(name, email, password) {
    try {
      const cred = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const { user } = cred;

      await user.updateProfile({
        displayName: name,
      });

      await this.db.collection("users").doc(user.uid).set({
        exists: true,
        displayName: user.displayName,
      });

      return "Success";
    } catch (err) {
      console.log("REGISTER ERROR: ", err);
    }
  }

  logout() {
    return this.auth.signOut();
  }

  async sendMessage(message, friendID) {
    const currentUserRef = this.db
      .collection("users")
      .doc(this.auth.currentUser.uid);

    const friendRef = this.db.collection("users").doc(friendID);

    try {
      await this.db.runTransaction(async (transaction) => {
        const { friends } = await (
          await transaction.get(currentUserRef)
        ).data();

        let chatID = friends[friendID];
        if (!chatID) {
          const newChat = this.db.collection("chats").doc();
          chatID = newChat.id;

          currentUserRef.set(
            {
              friends: {
                [friendID]: chatID,
              },
            },
            { merge: true }
          );

          friendRef.set(
            {
              friends: {
                [this.auth.currentUser.uid]: chatID,
              },
            },
            { merge: true }
          );
        }

        this.db.collection("chats").doc(chatID).collection("messages").add({
          from: this.auth.currentUser.uid,
          text: message,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
    } catch (err) {
      console.log("Transaction failure:", err.message);
    }
  }

  getUsers() {
    return this.db.collection("users").get();
  }

  async listenForNewMessages(dispatchMessages, friendID) {
    const { friends } = await (
      await this.db.collection("users").doc(this.auth.currentUser.uid).get()
    ).data();

    if (!friends[friendID]) return [];

    this.db
      .collection("chats")
      .doc(friends[friendID])
      .collection("messages")
      .where(
        "createdAt",
        ">=",
        firebase.firestore.Timestamp.fromDate(new Date())
      )
      .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
          return [];
        }
        console.log("SIZE: ", querySnapshot.size);

        const messages = [];
        querySnapshot.docChanges().forEach(function (message) {
          if (message.type === "added") {
            console.log("NEW MESSAGE: ", message.doc.data());
            const { from, text, createdAt } = message.doc.data();
            messages.push({ from, text, createdAt, id: message.doc.id });
          }
        });

        dispatchMessages(messages);
      });
  }

  async get10PreviousMessages() {
    // TODO: Don't let user fetch too fast!
    if (!this.lastMessageSnapshot) return [];

    const next10MessagesSnapshots = await this.db
      .collection("chats")
      .doc(this.chatID)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .startAfter(this.lastMessageSnapshot)
      .limit(10)
      .get();

    this.lastMessageSnapshot =
      next10MessagesSnapshots.docs[next10MessagesSnapshots.docs.length - 1];

    return next10MessagesSnapshots.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      .reverse();
  }

  async getLast20Messages(friendID) {
    try {
      const { friends } = await (
        await this.db.collection("users").doc(this.auth.currentUser.uid).get()
      ).data();

      if (!friends[friendID]) return [];

      this.chatID = friends[friendID];

      const last20MessagesSnapshots = await this.db
        .collection("chats")
        .doc(this.chatID)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

      const docsLength = last20MessagesSnapshots.docs.length;

      if (docsLength < 20) {
        this.lastMessageSnapshot = undefined;
      } else {
        this.lastMessageSnapshot = last20MessagesSnapshots.docs[docsLength - 1];
      }

      return last20MessagesSnapshots.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .reverse();
    } catch (err) {
      console.log("getLast20Messages error try/catch: ", err);
      return err.message;
    }
  }

  getMyUID() {
    return this.auth.currentUser.uid;
  }

  getUserInfo() {
    // const user = this.auth.currentUser;
    // user.providerData.forEach(function (profile) {
    //   console.log("Sign-in provider: " + profile.providerId);
    //   console.log("  Provider-specific UID: " + profile.uid);
    //   console.log("  Name: " + profile.displayName);
    //   console.log("  Email: " + profile.email);
    //   console.log("  Photo URL: " + profile.photoURL);
    // });
  }

  async changeProfilePicture(profilePicture) {
    return new Promise((resolve, reject) => {
      const profilePictureRef = this.storageRef.child(
        `profilePictures/${this.auth.currentUser.uid}`
      );

      console.log("fullPath: ", profilePictureRef.fullPath);
      console.log("name: ", profilePictureRef.name);
      console.log("bucket: ", profilePictureRef.bucket);

      const uploadTask = profilePictureRef.put(profilePicture);

      uploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
          }
        },
        function (err) {
          console.log("ERROR in uploadTask: ", err);
          reject(err.message);
        },
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  }

  async getMyAvatarURL() {
    if (this.avatarURL) return this.avatarURL;

    const avatarURL = await this.storageRef
      .child(`profilePictures/${this.auth.currentUser.uid}`)
      .getDownloadURL();

    this.avatarURL = avatarURL;

    return avatarURL;
  }

  async getFriendsAvatarURLs() {}
}

export default new Firebase();
