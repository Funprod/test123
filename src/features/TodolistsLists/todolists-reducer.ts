import { TodolistType } from '../../api/todolists-api';
import { RequestStatusType } from '../../features/App/app-reducer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addTodolist, changeTodolistTitle, fetchTodolists, removeTodolist } from './todolists-actions';

export const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string; status: RequestStatusType }>) {
            const index = state.findIndex((tl) => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.status;
        },
        clearTodolists() {
            return [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl) => ({
                    ...tl,
                    filter: 'all',
                    entityStatus: 'idle',
                }));
            })
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex((tl) => tl.id === action.payload.id);
                if (index > -1) {
                    state.splice(index, 1);
                }
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' });
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const index = state.findIndex((tl) => tl.id === action.payload.id);
                state[index].title = action.payload.title;
            });
    },
});

export const todolistsReducer = slice.reducer;

// Actions

export const { changeTodolistFilter, changeTodolistEntityStatus, clearTodolists } = slice.actions;

// Thunks

// Types
export type ChangeTodolistEntityStatusAT = ReturnType<typeof changeTodolistEntityStatus>;

export type ActionsType = ReturnType<typeof changeTodolistFilter> | ChangeTodolistEntityStatusAT;

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
