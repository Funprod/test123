import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, FieldErrorType, LoginParamsType } from '../../api/todolists-api';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { clearTasks } from '../TodolistsLists/tasks-reducer';
import { clearTodolists } from '../TodolistsLists/todolists-reducer';
import { setAppStatus } from '../../app/app-reducer';
import { ThunkError } from '../../app/store';

export const login = createAsyncThunk<undefined, LoginParamsType, ThunkError>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
            localStorage.setItem('sn-token', res.data.data.token);
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({ errors: [error], fieldsErrors: undefined });
    }
});

export const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
    try {
        const res = await authAPI.logout();
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
            thunkAPI.dispatch(clearTasks());
            thunkAPI.dispatch(clearTodolists());
            localStorage.removeItem('sn-token');
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({});
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
    }
});
