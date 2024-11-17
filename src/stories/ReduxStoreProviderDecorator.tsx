// store.ts
import { Provider } from 'react-redux';

import { todolistsReducer } from '../features/TodolistsLists/todolists-reducer';
import { v1 } from 'uuid';
import { combineReducers, legacy_createStore } from 'redux';

import { TaskPriorities, TaskStatuses } from '../api/todolists-api';
import { tasksReducer } from '../features/TodolistsLists/tasks-reducer';

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
});

const initialGlobalState: any = {
    todolists: [
        { id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: '', order: 0 },
        { id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: '', order: 0 },
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
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState);

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
