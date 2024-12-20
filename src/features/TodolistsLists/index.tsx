import * as tasksActions from './tasks-actions';
import * as todolistsAsyncActions from './todolists-actions';
import { slice } from './todolists-reducer';
import * as TodolistsList from './TodolistsList';

const todolistsActions = {
    ...todolistsAsyncActions,
    ...slice.actions,
};
export { tasksActions, todolistsActions, TodolistsList };
