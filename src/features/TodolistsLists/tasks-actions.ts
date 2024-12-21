import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAppStatus } from '../../app/app-reducer';
import { FieldErrorType, TaskType, todolistsAPI, UpdateTaskType } from '../../api/todolists-api';
import { changeTodolistEntityStatus } from './todolists-reducer';
import { handleAsyncServerNetworkError, handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';
import { UpdateDomainTaskModelType } from './tasks-reducer';
import { RootState, ThunkError } from '../../app/store';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
    const res = await todolistsAPI.getTasks(todolistId);
    thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
    return { tasks: res.data.items, todolistId };
});

export const removeTask = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todolistId: string; taskId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
        thunkAPI.dispatch(changeTodolistEntityStatus({ id: param.todolistId, status: 'loading' }));
        const res = await todolistsAPI.deleteTasks(param.todolistId, param.taskId);
        thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
        thunkAPI.dispatch(changeTodolistEntityStatus({ id: param.todolistId, status: 'idle' }));
        return { id: param.taskId, todolistId: param.todolistId };
    },
);

export const addTask = createAsyncThunk<TaskType, { title: string; todolistId: string }, ThunkError>(
    'tasks/addTask',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
        try {
            const res = await todolistsAPI.createTask(param.todolistId, param.title);
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
                return res.data.data.item;
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch, false);
                return thunkAPI.rejectWithValue({ errors: res.data.messages, fieldsErrors: res.data.fieldsErrors });
            }
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI);
            // return rejectWithValue({ errors: [error.messages], fieldsErrors: undefined });
        }
    },
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async (
        param: { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string },
        { dispatch, rejectWithValue, getState },
    ) => {
        dispatch(setAppStatus({ status: 'loading' }));
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
                dispatch(setAppStatus({ status: 'succeeded' }));
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
