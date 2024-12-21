import { action } from '@storybook/addon-actions';
import { Dispatch } from 'redux';
import { ResponseType } from '../api/todolists-api';
import { setAppError, setAppStatus, SetErrorAppActionType, SetStatusAppActionType } from '../app/app-reducer';
import { AxiosError } from 'axios';

export const handleServerAppError = <D>(
    data: ResponseType<D>,
    dispatch: Dispatch<SetErrorAppActionType | SetStatusAppActionType>,
    showError = true,
) => {
    if (showError) {
        dispatch(setAppError({ error: data.messages.length ? data.messages[0] : 'Some error occurred' }));
    }
    dispatch(setAppStatus({ status: 'failed' }));
};

export const handleServerNetworkError = (
    error: any,
    dispatch: Dispatch<SetErrorAppActionType | SetStatusAppActionType>,
    showError = true,
) => {
    if (showError) {
        dispatch(setAppError({ error: error.message ? error.message : 'some error occurred' }));
    }
    dispatch(setAppStatus({ status: 'failed' }));
};

type ThunkAPIType = {
    dispatch: (action: any) => any;
    rejectWithValue: Function;
};

export const handleAsyncServerAppError = <D>(data: ResponseType<D>, thunkAPI: ThunkAPIType, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppError({ error: data.messages.length ? data.messages[0] : 'Some error occurred' }));
    }
    thunkAPI.dispatch(setAppStatus({ status: 'failed' }));
    return thunkAPI.rejectWithValue({ errors: data.messages, fieldsErrors: data.fieldsErrors });
};

export const handleAsyncServerNetworkError = (error: any, thunkAPI: ThunkAPIType, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppError({ error: error.message ? error.message : 'some error occurred' }));
    }
    thunkAPI.dispatch(setAppStatus({ status: 'failed' }));
    return thunkAPI.rejectWithValue({ errors: [error.message], fieldsErrors: undefined });
};
