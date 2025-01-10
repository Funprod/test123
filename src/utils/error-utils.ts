import { ResponseType } from '../api/todolists-api';
import { setAppError, setAppStatus } from '../features/App/app-reducer';

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
