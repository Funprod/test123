import { Dispatch } from 'redux';
import { authAPI } from '../api/todolists-api';
import { setIsLoggedInAC } from '../features/Login/auth-reducer';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initializedAppTC = createAsyncThunk('app/initializedApp', async (param, { dispatch }) => {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({ value: true }));
    } else {
    }
});

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        initialized: false,
    } as InitialStateType,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initializedAppTC.fulfilled, (state) => {
            state.initialized = true;
        });
    },
});

export const { setAppErrorAC, setAppStatusAC } = slice.actions;

export const appReducer = slice.reducer;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type InitialStateType = {
    status: RequestStatusType;
    error: string | null;
    initialized: boolean;
};

export type SetErrorAppActionType = ReturnType<typeof slice.actions.setAppErrorAC>;
export type SetStatusAppActionType = ReturnType<typeof slice.actions.setAppStatusAC>;
