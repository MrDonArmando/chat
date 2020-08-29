import {createStore, combineReducers, applyMiddleware, compose} from "redux";
import thunk from 'redux-thunk';
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import chat from "./chat/reducer";
import { useSelector, TypedUseSelectorHook } from 'react-redux'

const rootReducer = combineReducers({chat});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export type RootState = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export default store;