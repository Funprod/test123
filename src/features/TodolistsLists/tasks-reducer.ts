import { TaskStateType } from '../../app/App';
import { todolistsAPI, UpdateTaskType } from '../../api/todolists-api';
import { RootState } from '../../app/store';
import {
    addTodolistTC,
    changeTodolistEntityStatusAC,
    ChangeTodolistEntityStatusAT,
    fetchTodolistsTC,
    removeTodolistTC,
} from './todolists-reducer';
import { setAppStatusAC } from '../../app/app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState: TaskStateType = {};

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
    const res = await todolistsAPI.getTasks(todolistId);
    thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
    return { tasks: res.data.items, todolistId };
});

export const removeTaskTC = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todolistId: string; taskId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }));
        thunkAPI.dispatch(changeTodolistEntityStatusAC({ id: param.todolistId, status: 'loading' }));
        const res = await todolistsAPI.deleteTasks(param.todolistId, param.taskId);
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }));
        thunkAPI.dispatch(changeTodolistEntityStatusAC({ id: param.todolistId, status: 'idle' }));
        return { id: param.taskId, todolistId: param.todolistId };
    },
);

export const addTaskTC = createAsyncThunk(
    'tasks/addTask',
    async (param: { title: string; todolistId: string }, { dispatch, rejectWithValue }) => {
        dispatch(setAppStatusAC({ status: 'loading' }));
        try {
            const res = await todolistsAPI.createTask(param.todolistId, param.title);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({ status: 'succeeded' }));
                return res.data.data.item;
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

export const updateTaskTC = createAsyncThunk(
    'tasks/updateTask',
    async (
        param: { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string },
        { dispatch, rejectWithValue, getState },
    ) => {
        dispatch(setAppStatusAC({ status: 'loading' }));
        const state = getState() as RootState;
        const task = state.tasks[param.todolistId].find((t) => t.id === param.taskId);
        if (!task) {
            console.warn('Task not found in the state');
            return rejectWithValue(null);
        }
        const apiModel: UpdateTaskType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            title: task.title,
            ...param.domainModel,
        };
        try {
            const res = await todolistsAPI.updateTask(param.todolistId, param.taskId, apiModel);
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({ status: 'succeeded' }));
                return { id: param.taskId, model: param.domainModel, todolistId: param.todolistId };
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
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = [];
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.id];
        });
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl) => {
                state[tl.id] = [];
            });
        });
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks;
        });
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex((t) => t.id === action.payload.id);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        });
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload);
        });
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
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
