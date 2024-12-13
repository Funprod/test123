import { Dispatch } from 'redux';
import { ResponseType } from '../api/todolists-api';
import { setAppErrorAC, setAppStatusAC, SetErrorAppActionType, SetStatusAppActionType } from '../app/app-reducer';

export const handleServerAppError = <D>(
    data: ResponseType<D>,
    dispatch: Dispatch<SetErrorAppActionType | SetStatusAppActionType>,
) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({ error: data.messages[0] }));
    } else {
        dispatch(setAppErrorAC({ error: 'Some error occurred' }));
    }
    dispatch(setAppStatusAC({ status: 'failed' }));
};

export const handleServerNetworkError = (
    error: any,
    dispatch: Dispatch<SetErrorAppActionType | SetStatusAppActionType>,
) => {
    dispatch(setAppErrorAC({ error: error.message ? error.message : 'some error occurred' }));
    dispatch(setAppStatusAC({ status: 'failed' }));
};
