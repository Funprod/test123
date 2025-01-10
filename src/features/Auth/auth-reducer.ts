import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, logout } from './auth-actions';

export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state) => {
                state.isLoggedIn = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false;
            });
    },
});

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;

// thunks
