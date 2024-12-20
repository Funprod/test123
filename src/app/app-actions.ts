import { createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../api/todolists-api';
import { useActions } from './store';
import { authActions } from '../features/Auth';
import { setIsLoggedIn } from '../features/Auth/auth-reducer';

export const initializedApp = createAsyncThunk('app/initializedApp', async (param, { dispatch }) => {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn({ value: true }));
    } else {
    }
});
