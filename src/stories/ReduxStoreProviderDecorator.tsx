// store.ts
import { Provider } from 'react-redux';
import { todolistsReducer } from '../features/TodolistsLists';
import { v1 } from 'uuid';
import { combineReducers } from 'redux';
import { TaskPriorities, TaskStatuses } from '../api/todolists-api';
import { tasksReducer } from '../features/TodolistsLists';
import { appReducer } from '../features/App';
import { thunk } from 'redux-thunk';
import { authReducer } from '../features/Auth';
import { RootReducerType, RootState } from '../app/store';
import { configureStore } from '@reduxjs/toolkit';
import { HashRouter } from 'react-router-dom';

const rootReducer: RootReducerType = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
});

const initialGlobalState: RootState = {
    todolists: [
        {
            id: 'todolistId1',
            title: 'What to learn What to learn What to learn What to learn  What to learn What to learn',
            filter: 'all',
            addedDate: '',
            order: 0,
            entityStatus: 'idle',
        },
        { id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'loading' },
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                deadline: '',
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                deadline: '',
            },
        ],
        ['todolistId2']: [
            {
                id: v1(),
                title: 'Milk',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                deadline: '',
            },
            {
                id: v1(),
                title: 'React Book',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                deadline: '',
            },
        ],
    },
    app: {
        error: null,
        status: 'idle',
        isInitialized: true,
    },
    auth: {
        isLoggedIn: true,
    },
};

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
export const BrowserRouterDecorator = (storyFn: any) => {
    return <HashRouter>{storyFn()}</HashRouter>;
};
