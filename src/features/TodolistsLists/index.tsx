import * as tasksActions from './tasks-actions';
import * as todolistsAsyncActions from './todolists-actions';
import { slice as todolistsSlice } from './todolists-reducer';
import * as TodolistsList from './TodolistsList';
import { slice as tasksSLice } from './tasks-reducer';

const todolistsActions = {
    ...todolistsAsyncActions,
    ...todolistsSlice.actions,
};

const todolistsReducer = todolistsSlice.reducer;
const tasksReducer = tasksSLice.reducer;

export { tasksActions, todolistsActions, TodolistsList, todolistsReducer, tasksReducer };
