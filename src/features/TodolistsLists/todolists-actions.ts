import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAppStatus } from '../../app/app-reducer';
import {
    handleAsyncServerAppError,
    handleAsyncServerNetworkError,
    handleServerNetworkError,
} from '../../utils/error-utils';
import { changeTodolistEntityStatus } from './todolists-reducer';
import { FieldErrorType, todolistsAPI, TodolistType } from '../../api/todolists-api';
import { ThunkError } from '../../app/store';

export const fetchTodolists = createAsyncThunk(
    'todolists/fetchTodolists',
    async (param, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }));
        try {
            const res = await todolistsAPI.getTodolists();
            dispatch(setAppStatus({ status: 'succeeded' }));
            return { todolists: res.data };
        } catch (error) {
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);
        }
    },
);

export const removeTodolist = createAsyncThunk(
    'todolists/removeTodolist',
    async (param: { todolistId: string }, { dispatch, rejectWithValue }) => {
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
                // handleServerAppError(res.data, thunkAPI.dispatch, false);
                // return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
                return handleAsyncServerAppError(res.data, thunkAPI, false);
            }
        } catch (error) {
            // handleServerNetworkError(error, thunkAPI.dispatch, false);
            // return thunkAPI.rejectWithValue({ errors: [error], fieldsErrors: undefined });
            handleAsyncServerNetworkError(error, thunkAPI, false);
        }
    },
);
export const changeTodolistTitle = createAsyncThunk(
    'todolists/changeTodolistTitle',
    async (param: { todolistId: string; title: string }, thunkAPI) => {
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
    },
);
