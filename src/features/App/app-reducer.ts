import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initializedApp } from '../../app/app-actions';

export const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false,
    } as InitialStateType,
    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initializedApp.fulfilled, (state) => {
            state.isInitialized = true;
        });
    },
});

export const { setAppError, setAppStatus } = slice.actions;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type InitialStateType = {
    status: RequestStatusType;
    error: string | null;
    isInitialized: boolean;
};

// export type SetErrorAppActionType = ReturnType<typeof slice.actions.setAppError>;
// export type SetStatusAppActionType = ReturnType<typeof slice.actions.setAppStatus>;
