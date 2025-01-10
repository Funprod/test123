import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAppStatus } from '../../features/App/app-reducer';
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from '../../utils/error-utils';
import { changeTodolistEntityStatus } from './todolists-reducer';
import { todolistsAPI, TodolistType } from '../../api/todolists-api';
import { ThunkError } from '../../app/store';

export const fetchTodolists = createAsyncThunk<{ todolists: TodolistType[] }, undefined, ThunkError>(
    'todolists/fetchTodolists',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
        try {
            const res = await todolistsAPI.getTodolists();
            thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
            return { todolists: res.data };
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI);
            // return thunkAPI.rejectWithValue(null);
        }
    },
);

export const removeTodolist = createAsyncThunk<{ id: string }, { todolistId: string }, ThunkError>(
    'todolists/removeTodolist',
    async (param, { dispatch }) => {
        dispatch(setAppStatus({ status: 'loading' }));
        dispatch(changeTodolistEntityStatus({ id: param.todolistId, status: 'loading' }));
        const res = await todolistsAPI.deleteTodolist(param.todolistId);
        dispatch(setAppStatus({ status: 'succeeded' }));
        return { id: param.todolistId };
    },
);

export const addTodolist = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>(
    'todolists/addTodolist',
    async (title, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
        try {
            const res = await todolistsAPI.createTodolist(title);
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
                return { todolist: res.data.data.item };
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI, false);
            }
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI, false);
        }
    },
);
export const changeTodolistTitle = createAsyncThunk<
    { id: string; title: string },
    { todolistId: string; title: string },
    ThunkError
>('todolists/changeTodolistTitle', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
    const res = await todolistsAPI.updateTodolists(param.todolistId, param.title);
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
            return { id: param.todolistId, title: param.title };
        } else {
            // handleServerAppError(res.data, thunkAPI.dispatch, false);
            return handleAsyncServerAppError(res.data, thunkAPI);
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI, false);
    }
});
