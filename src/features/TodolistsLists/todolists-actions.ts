import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAppStatus } from '../../app/app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { changeTodolistEntityStatus } from './todolists-reducer';
import { todolistsAPI } from '../../api/todolists-api';

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

export const addTodolist = createAsyncThunk(
    'todolists/addTodolist',
    async (title: string, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }));
        try {
            const res = await todolistsAPI.createTodolist(title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({ status: 'succeeded' }));
                return { todolist: res.data.data.item };
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);
        }
    },
);
export const changeTodolistTitle = createAsyncThunk(
    'todolists/changeTodolistTitle',
    async (param: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatus({ status: 'loading' }));
        const res = await todolistsAPI.updateTodolists(param.todolistId, param.title);
        try {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({ status: 'succeeded' }));
                return { id: param.todolistId, title: param.title };
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);
        }
    },
);
