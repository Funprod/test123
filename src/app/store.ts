import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import { tasksReducer } from '../features/TodolistsLists/tasks-reducer';
import { todolistsReducer } from '../features/TodolistsLists/todolists-reducer';
import { appReducer } from './app-reducer';
import { authReducer } from '../features/Login/auth-reducer';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

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

type AppDispatchType = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatchType>();
