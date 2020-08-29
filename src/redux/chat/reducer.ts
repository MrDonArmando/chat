import {  MessagesState, MessagesActionTypes} from "./interfaces"
import { ADD_LAST_20_MESSAGES, START_FETCHING_20_LAST_MESSAGES, STOP_FETCHING_20_LAST_MESSAGES, ADD_ERROR, ADD_NEW_MESSAGES, SET_FRIEND_ID, ADD_10_PREVIOUS_MESSAGES, START_FETCHING_10_PREVIOUS_MESSAGES, STOP_FETCHING_10_PREVIOUS_MESSAGES} from "./types";



const initialState: MessagesState = {
    messages:[],
    friendID: undefined,
    isFetching20LastMessages: false,
    isFetching10PreviousMessages: false,
    error: undefined
}

export default (state = initialState, action:MessagesActionTypes) => {

    switch(action.type){
        case ADD_LAST_20_MESSAGES:
            const {messages} = action.payload;
            return {
                ...state,
                messages: [...messages]
            }
            
        case ADD_NEW_MESSAGES: 
        return {
            ...state,
            messages: [...state.messages, ...action.payload.messages]
        }

        case ADD_10_PREVIOUS_MESSAGES: {
            const {messages} = action.payload;
            if(messages.length === 0) return state;// Don't update state if there is no more messages
            return {
                ...state,
                messages: [...messages, ...state.messages]
            }
        }
   
        case SET_FRIEND_ID: 
            return {
                ...state, friendID: action.payload.friendID
            }

        case START_FETCHING_20_LAST_MESSAGES: 
            return {
                ...state,
                isFetching20LastMessages: true
            }

        case STOP_FETCHING_20_LAST_MESSAGES:
            return {
                ...state,
                isFetching20LastMessages: false 
            }

        case START_FETCHING_10_PREVIOUS_MESSAGES: 
            return {
                ...state,
                isFetching10PreviousMessages: true
            }
        
        case STOP_FETCHING_10_PREVIOUS_MESSAGES: 
            return {
                ...state,
                isFetching10PreviousMessages: false
            }

        case ADD_ERROR:
            const {error} = action.payload;
            return {
                ...state,
                error   
            } 
        
        default:
            return state
    }
}