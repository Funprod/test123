import { action } from '@storybook/addon-actions';
import { todolistsAPI, TodolistType } from '../../api/todolists-api';
import { Dispatch } from 'redux';
import {
    RequestStatusType,
    setAppStatusAC,
    SetErrorAppActionType,
    SetStatusAppActionType,
} from '../../app/app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const fetchTodolistsTC = createAsyncThunk(
    'todolists/fetchTodolists',
    async (param, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }));
        try {
            const res = await todolistsAPI.getTodolists();
            dispatch(setAppStatusAC({ status: 'succeeded' }));
            return { todolists: res.data };
        } catch (error) {
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);
        }
    },
);

export const removeTodolistTC = createAsyncThunk(
    'todolists/removeTodolist',
    async (param: { todolistId: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }));
        dispatch(changeTodolistEntityStatusAC({ id: param.todolistId, status: 'loading' }));
        const res = await todolistsAPI.deleteTodolist(param.todolistId);
        dispatch(setAppStatusAC({ status: 'succeeded' }));
        return { id: param.todolistId };
    },
);

export const addTodolistTC = createAsyncThunk(
    'todolists/addTodolist',
    async (param: { title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }));
        try {
            const res = await todolistsAPI.createTodolist(param.title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({ status: 'succeeded' }));
                return { todolist: res.data.data.item };
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);
        }
    },
);
export const changeTodolistTitleTC = createAsyncThunk(
    'todolists/changeTodolistTitle',
    async (param: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }));
        const res = await todolistsAPI.updateTodolists(param.todolistId, param.title);
        try {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({ status: 'succeeded' }));
                return { id: param.todolistId, title: param.title };
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (error) {
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);
        }
    },
);

const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string; status: RequestStatusType }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.status;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map((tl) => ({ ...tl, filter: 'all', entityStatus: 'idle' }));
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
            }
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' });
        });
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            state[index].title = action.payload.title;
        });
    },
});

export const todolistsReducer = slice.reducer;

// Actions

export const { changeTodolistFilterAC, changeTodolistEntityStatusAC } = slice.actions;

// Thunks

// Types
export type ChangeTodolistEntityStatusAT = ReturnType<typeof changeTodolistEntityStatusAC>;

export type ActionsType = ReturnType<typeof changeTodolistFilterAC> | ChangeTodolistEntityStatusAT;

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};

type ThunkDispatch = Dispatch<ActionsType | SetStatusAppActionType | SetErrorAppActionType>;
