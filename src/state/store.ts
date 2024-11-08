import { AnyAction } from 'redux';
// import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
// import { todolistsReducer } from './todolists-reducer';
// import { tasksReducer } from './tasks-reducer';
// import { thunk } from 'redux-thunk';

// const rootReducer = combineReducers({
//     todolists: todolistsReducer,
//     tasks: tasksReducer,
// });

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

// // определить автоматически тип всего объекта состояния
// export type RootState = ReturnType<typeof store.getState>;

// // а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// // @ts-ignore
// window.store = store;
import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { todolistsReducer } from './todolists-reducer';
import { tasksReducer } from './tasks-reducer';
import { thunk, ThunkDispatch } from 'redux-thunk';

// Combine reducers
const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
});

// Create the store with thunk middleware
export const store = legacy_createStore(rootReducer, undefined, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;

// For debugging: make the store available in the console
// @ts-ignore
window.store = store;

export default store;
