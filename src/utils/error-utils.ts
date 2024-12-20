import { Dispatch } from 'redux';
import { ResponseType } from '../api/todolists-api';
import { setAppError, setAppStatus, SetErrorAppActionType, SetStatusAppActionType } from '../app/app-reducer';

export const handleServerAppError = <D>(
    data: ResponseType<D>,
    dispatch: Dispatch<SetErrorAppActionType | SetStatusAppActionType>,
) => {
    if (data.messages.length) {
        dispatch(setAppError({ error: data.messages[0] }));
    } else {
        dispatch(setAppError({ error: 'Some error occurred' }));
    }
    dispatch(setAppStatus({ status: 'failed' }));
};

export const handleServerNetworkError = (
    error: any,
    dispatch: Dispatch<SetErrorAppActionType | SetStatusAppActionType>,
) => {
    dispatch(setAppError({ error: error.message ? error.message : 'some error occurred' }));
    dispatch(setAppStatus({ status: 'failed' }));
};
