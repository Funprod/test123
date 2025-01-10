import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, LoginParamsType } from '../../api/todolists-api';
import { clearTasks } from '../TodolistsLists/tasks-reducer';
import { clearTodolists } from '../TodolistsLists/todolists-reducer';
import { setAppStatus } from '../../features/App/app-reducer';
import { ThunkError } from '../../app/store';
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from '../../utils/error-utils';

export const login = createAsyncThunk<undefined, LoginParamsType, ThunkError>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
            localStorage.setItem('sn-token', res.data.data.token);
            return;
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI);
            // return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI);
        // return thunkAPI.rejectWithValue({ errors: [error], fieldsErrors: undefined });
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
            return handleAsyncServerAppError(res.data, thunkAPI);
            // return thunkAPI.rejectWithValue({});
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI);
        // return thunkAPI.rejectWithValue({});
    }
});
