import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import { tasksReducer } from '../features/TodolistsLists/tasks-reducer';
import { todolistsReducer } from '../features/TodolistsLists/todolists-reducer';

// Combine reducers
const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
});

// Create the store with thunk middleware
export const store = legacy_createStore(rootReducer, {}, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;

// For debugging: make the store available in the console
// @ts-ignore
window.store = store;

export default store;
