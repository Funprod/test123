import { Dispatch } from 'redux';
import { TaskStateType } from '../../app/App';
import { TaskType, todolistsAPI, UpdateTaskType } from '../../api/todolists-api';
import { RootState } from '../../app/store';
import { AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType } from './todolists-reducer';
import { setErrorAC, SetErrorActionType, setStatusAC, SetStatusActionType } from '../../app/app-reducer';

const initialState: TaskStateType = {};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE_TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter((t) => t.id !== action.payload.id),
            };
        case 'ADD_TASK':
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]],
            };
        case 'UPDATE_TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
                    t.id === action.payload.id ? { ...t, ...action.payload.model } : t,
                ),
            };
        case 'ADD-TODOLIST':
            return { ...state, [action.payload.todolist.id]: [] };
        case 'REMOVE-TODOLIST':
            const stateCopy = { ...state };
            delete stateCopy[action.payload.id];
            return stateCopy;
        case 'SET-TODOLIST': {
            const stateCopy = { ...state };
            action.payload.todolists.forEach((tl) => {
                stateCopy[tl.id] = [];
            });
            return stateCopy;
        }
        case 'SET_TASKS':
            return { ...state, [action.payload.todolistId]: action.payload.tasks };
        default:
            return state;
    }
};

// Actions
export const removeTaskAC = (id: string, todolistId: string) =>
    ({ type: 'REMOVE_TASK', payload: { id, todolistId } }) as const;
export const addTaskAC = (task: TaskType) => ({ type: 'ADD_TASK', payload: { task } }) as const;
export const updateTaskAC = (id: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({ type: 'UPDATE_TASK', payload: { id, model, todolistId } }) as const;
export const changeTaskTitleAC = (id: string, newTitle: string, todolistId: string) =>
    ({ type: 'CHANGE_TASK_TITLE', payload: { id, newTitle, todolistId } }) as const;
export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
    ({ type: 'SET_TASKS', payload: { tasks, todolistId } }) as const;

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType | SetStatusActionType>) => {
    dispatch(setStatusAC('loading'));
    todolistsAPI.getTasks(todolistId).then((res) => {
        dispatch(setTasksAC(res.data.items, todolistId));
        dispatch(setStatusAC('succeeded'));
    });
};
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.deleteTasks(todolistId, taskId).then((res) => {
        dispatch(removeTaskAC(taskId, todolistId));
    });
};
export const addTaskTC =
    (title: string, todolistId: string) =>
    (dispatch: Dispatch<ActionsType | SetErrorActionType | SetStatusActionType>) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.createTask(todolistId, title).then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item));
                dispatch(setStatusAC('succeeded'));
            } else {
                if (res.data.messages.length) {
                    dispatch(setErrorAC(res.data.messages[0]));
                } else {
                    dispatch(setErrorAC('Some error occurred'));
                }
                dispatch(setStatusAC('failed'));
            }
        });
    };
export const updateTaskTC =
    (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => RootState) => {
        const state = getState();
        const task = state.tasks[todolistId].find((t) => t.id === taskId);
        if (!task) {
            console.warn('Task not found in the state');
            return;
        }
        const apiModel: UpdateTaskType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            title: task.title,
            ...domainModel,
        };
        todolistsAPI.updateTask(todolistId, taskId, apiModel).then((res) => {
            dispatch(updateTaskAC(taskId, domainModel, todolistId));
        });
    };

// Types
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType;

export type UpdateDomainTaskModelType = {
    description?: string;
    title?: string;
    status?: number;
    priority?: number;
    startDate?: string;
    deadline?: string;
};
