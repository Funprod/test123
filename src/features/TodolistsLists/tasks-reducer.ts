import { TaskStateType } from '../../app/App';
import { addTask, fetchTasks, removeTask, updateTask } from './tasks-actions';
import { addTodolist, fetchTodolists, removeTodolist } from './todolists-actions';
import { ChangeTodolistEntityStatusAT } from './todolists-reducer';
import { createSlice } from '@reduxjs/toolkit';
const initialState: TaskStateType = {};

export const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearTasks() {
            return {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolist.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = [];
        });
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl) => {
                state[tl.id] = [];
            });
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks;
        });
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex((t) => t.id === action.payload.id);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        });
        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload);
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex((t) => t.id === action.payload.id);
            if (index > -1) {
                tasks[index] = { ...tasks[index], ...action.payload.model };
            }
        });
    },
});

export const tasksReducer = slice.reducer;
// Actions
export const { clearTasks } = slice.actions;
// Thunks

// Types
export type ActionsTasksType = ChangeTodolistEntityStatusAT;
export type UpdateDomainTaskModelType = {
    description?: string;
    title?: string;
    status?: number;
    priority?: number;
    startDate?: string;
    deadline?: string;
};
