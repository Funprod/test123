import { Dispatch } from 'redux';
import { authAPI, FieldErrorType, LoginParamsType } from '../../api/todolists-api';
import { setAppStatusAC } from '../../app/app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const loginTC = createAsyncThunk<
    undefined,
    LoginParamsType,
    {
        rejectValue: { errors: Array<unknown>; fieldsErrors?: FieldErrorType[] };
    }
>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
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

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
    try {
        const res = await authAPI.logout();
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
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

// export const logOutTC_ = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({ status: 'loading' }));
//     authAPI
//         .logout()
//         .then((res) => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({ value: false }));
//                 dispatch(setAppStatusAC({ status: 'succeeded' }));
//                 localStorage.removeItem('sn-token');
//             } else {
//                 handleServerAppError(res.data, dispatch);
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch);
//         });
// };

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true;
        });
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false;
        });
    },
});

export const authReducer = slice.reducer;

export const { setIsLoggedInAC } = slice.actions;

// thunks
