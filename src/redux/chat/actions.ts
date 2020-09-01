import {
  ADD_LAST_20_MESSAGES,
  ADD_ERROR,
  ADD_NEW_MESSAGES,
  SET_FRIEND_ID,
  ADD_10_PREVIOUS_MESSAGES,
  START_FETCHING_20_LAST_MESSAGES,
  STOP_FETCHING_20_LAST_MESSAGES,
  STOP_FETCHING_10_PREVIOUS_MESSAGES,
  START_FETCHING_10_PREVIOUS_MESSAGES,
} from "./types";
import { Message } from "./interfaces";
import firebase from "../../global_components/firebase";
import { AppThunk } from "../store";

export const fetchLast20Messages = (friendID: string): AppThunk => async (
  dispatch,
  getState
) => {
  dispatch(startFetching20LastMessages());
  try {
    const last20Messages = await firebase.getLast20Messages(friendID);
    if (last20Messages === undefined) {
      addLast20Messages([]);
    } else {
      dispatch(stopFetching20LastMessages());
      dispatch(addLast20Messages(last20Messages));
    }
  } catch (err) {
    console.log("error in fetchLast20Messages: ", err.message);
    dispatch(addError(err.message));
  } finally {
    firebase.cancelPreviousListener();
    firebase.listenForNewMessages(
      (messages: Message[]) => dispatch(addNewMessages(messages)),
      friendID
    );
  }
};

export const sendMessage = (
  message: string,
  friendID: string
): AppThunk => async (dispatch, getState) => {
  try {
    await firebase.sendMessage(message, friendID);
  } catch (err) {
    dispatch(addError(err.message));
  }
};

export const fetch10PreviousMessages = (): AppThunk => async (dispatch) => {
  dispatch(startFetching10PreviousMessages());
  try {
    const previous10Messages = await firebase.get10PreviousMessages();
    if (previous10Messages === undefined) {
      add10PreviousMessages([]);
    } else {
      dispatch(stopFetching10PreviousMessages());
      dispatch(add10PreviousMessages(previous10Messages));
    }
  } catch (err) {
    console.log("error in fetchLast10Messages: ", err.message);
    dispatch(addError(err.message));
  }
};

const addLast20Messages = (messages: Message[]) => ({
  type: ADD_LAST_20_MESSAGES,
  payload: {
    messages,
  },
});

export const setFriendID = (friendID: string) => ({
  type: SET_FRIEND_ID,
  payload: {
    friendID,
  },
});

const addError = (error: string[]) => ({
  type: ADD_ERROR,
  payload: {
    error,
  },
});

const addNewMessages = (messages: Message[]) => ({
  type: ADD_NEW_MESSAGES,
  payload: {
    messages,
  },
});

const add10PreviousMessages = (messages: Message[]) => ({
  type: ADD_10_PREVIOUS_MESSAGES,
  payload: {
    messages,
  },
});

const startFetching20LastMessages = () => ({
  type: START_FETCHING_20_LAST_MESSAGES,
});

const stopFetching20LastMessages = () => ({
  type: STOP_FETCHING_20_LAST_MESSAGES,
});

const startFetching10PreviousMessages = () => ({
  type: START_FETCHING_10_PREVIOUS_MESSAGES,
});

const stopFetching10PreviousMessages = () => ({
  type: STOP_FETCHING_10_PREVIOUS_MESSAGES,
});
