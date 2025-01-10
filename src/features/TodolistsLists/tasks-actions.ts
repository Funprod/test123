import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAppStatus } from '../../features/App/app-reducer';
import { TaskType, todolistsAPI, UpdateTaskType } from '../../api/todolists-api';
import { changeTodolistEntityStatus } from './todolists-reducer';
import { handleAsyncServerAppError, handleAsyncServerNetworkError } from '../../utils/error-utils';
import { UpdateDomainTaskModelType } from './tasks-reducer';
import { RootState, ThunkError } from '../../app/store';

export const fetchTasks = createAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string, ThunkError>(
    'tasks/fetchTasks',
    async (todolistId, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
        try {
            const res = await todolistsAPI.getTasks(todolistId);
            thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
            return { tasks: res.data.items, todolistId };
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI);
        }
    },
);

export const removeTask = createAsyncThunk<
    { taskId: string; todolistId: string },
    { todolistId: string; taskId: string },
    ThunkError
>('tasks/removeTask', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
    thunkAPI.dispatch(changeTodolistEntityStatus({ id: param.todolistId, status: 'loading' }));
    const res = await todolistsAPI.deleteTasks(param.todolistId, param.taskId);
    thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
    thunkAPI.dispatch(changeTodolistEntityStatus({ id: param.todolistId, status: 'idle' }));
    return { taskId: param.taskId, todolistId: param.todolistId };
});

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
                handleAsyncServerAppError(res.data, thunkAPI, false);
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
    async (param: { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({ status: 'loading' }));
        const state = thunkAPI.getState() as RootState;
        const task = state.tasks[param.todolistId].find((t) => t.id === param.taskId);
        if (!task) {
            console.warn('Task not found in the state');
            return thunkAPI.rejectWithValue(null);
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
                thunkAPI.dispatch(setAppStatus({ status: 'succeeded' }));
                return { id: param.taskId, model: param.domainModel, todolistId: param.todolistId };
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI);
                // return thunkAPI.rejectWithValue(null);
            }
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI);
            // return thunkAPI.rejectWithValue(null);
        }
    },
);
