import { ActionCreatorsMapObject, bindActionCreators, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { tasksReducer } from '../features/TodolistsLists';
import { todolistsReducer } from '../features/TodolistsLists';
import { appReducer } from '../features/App';
import { authReducer } from '../features/Auth';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { FieldErrorType } from '../api/todolists-api';

// Combine reducers
const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
});

// Create the store with thunk middleware
// export const store = legacy_createStore(rootReducer, {}, applyMiddleware(thunk));

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export type RootReducerType = typeof rootReducer;

export type RootState = ReturnType<RootReducerType>;

// For debugging: make the store available in the console
// @ts-ignore
window.store = store;

export default store;

export type ThunkError = { rejectValue: { errors: Array<unknown>; fieldsErrors?: FieldErrorType[] } };
