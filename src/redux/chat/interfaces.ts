import { ADD_LAST_20_MESSAGES, ADD_ERROR, ADD_NEW_MESSAGES, SET_FRIEND_ID, SEND_MESSAGE, ADD_10_PREVIOUS_MESSAGES, START_FETCHING_20_LAST_MESSAGES, STOP_FETCHING_20_LAST_MESSAGES, START_FETCHING_10_PREVIOUS_MESSAGES, STOP_FETCHING_10_PREVIOUS_MESSAGES } from "./types";

export interface Message{
    text: string,
    createdAt: {
        seconds: number,
        nanoseconds:number
    },
    from: string,
    id: string
}

export interface MessagesState{
    messages: Message[],
    friendID: string | undefined,
    isFetching20LastMessages: boolean,
    isFetching10PreviousMessages: boolean,
    error: string | undefined
}


export interface AddLast20MessagesAction{
    type: typeof ADD_LAST_20_MESSAGES,
    payload: {
        messages: Message[] 
    }
}

export interface AddNewMessagesAction{
    type: typeof ADD_NEW_MESSAGES,
    payload: {
        messages: Message[]
    }
}

export interface Add10PreviousMessagesActions{
    type: typeof ADD_10_PREVIOUS_MESSAGES,
    payload: {
        messages: Message[]
    }
}

export interface SetFriendIDAction{
    type: typeof SET_FRIEND_ID,
    payload: {
        friendID: string
    }
}

export interface SendMessageAction{
    type: typeof SEND_MESSAGE,
    payload: {
        message: string
    }
}

export interface StartFetching20LastMessagesAction{
    type: typeof START_FETCHING_20_LAST_MESSAGES
}

export interface StopFetching20LastMessagesAction{
    type: typeof STOP_FETCHING_20_LAST_MESSAGES
}

export interface StartFetching10PreviousMessagesAction{
    type: typeof START_FETCHING_10_PREVIOUS_MESSAGES
}

export interface StopFetching10PreviousMessagesAction{
    type: typeof STOP_FETCHING_10_PREVIOUS_MESSAGES
}

export interface AddErrorAction{
    type: typeof ADD_ERROR,
    payload: {
        error: string | undefined
    }
}


export type MessagesActionTypes = AddLast20MessagesAction 
                                | AddNewMessagesAction
                                | Add10PreviousMessagesActions
                                | SetFriendIDAction
                                | SendMessageAction
                                | StartFetching20LastMessagesAction  
                                | StopFetching20LastMessagesAction
                                | StartFetching10PreviousMessagesAction
                                | StopFetching10PreviousMessagesAction 
                                | AddErrorAction
                               