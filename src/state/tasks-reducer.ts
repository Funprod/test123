import { v1 } from 'uuid';
import { TaskStateType } from '../AppWithRedux';
import { AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType } from './todolists-reducer';
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskType } from '../api/todolists-api';
import { Dispatch } from 'redux';
import { RootState } from './store';

export type RemoveTaskACActionType = {
    type: 'REMOVE_TASK';
    payload: {
        taskId: string;
        todolistId: string;
    };
};

export type AddTaskACActionType = {
    type: 'ADD_TASK';
    payload: {
        task: TaskType;
    };
};

export type UpdateTaskACActionType = {
    type: 'UPDATE_TASK';
    payload: {
        taskId: string;
        todolistId: string;
        model: UpdateDomainTaskModelType;
    };
};

export type ChangeTaskTitleACActionType = {
    type: 'CHANGE_TASK_TITLE';
    payload: {
        taskId: string;
        newTitle: string;
        todolistId: string;
    };
};
export type setTasksActionType = {
    type: 'SET_TASKS';
    payload: {
        tasks: TaskType[];
        todolistId: string;
    };
};

type ActionsType =
    | RemoveTaskACActionType
    | AddTaskACActionType
    | UpdateTaskACActionType
    | ChangeTaskTitleACActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | setTasksActionType;

const initialState: TaskStateType = {};

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE_TASK': {
            const stateCopy = { ...state };
            const tasks = state[action.payload.todolistId];
            const filteredTasks = tasks.filter((t) => t.id !== action.payload.taskId);
            stateCopy[action.payload.todolistId] = filteredTasks;
            return stateCopy;
        }
        case 'ADD_TASK': {
            const stateCopy = { ...state };
            const tasks = stateCopy[action.payload.task.todoListId];
            const newTasks = [action.payload.task, ...tasks];
            stateCopy[action.payload.task.todoListId] = newTasks;
            return stateCopy;
        }
        case 'UPDATE_TASK': {
            const { taskId, model, todolistId } = action.payload;
            return {
                ...state,
                [todolistId]: state[todolistId].map((t) => (t.id === taskId ? { ...t, ...model } : t)),
            };
        }
        case 'CHANGE_TASK_TITLE': {
            const { taskId, newTitle, todolistId } = action.payload;
            return {
                ...state,
                [todolistId]: state[todolistId].map((t) => (t.id === taskId ? { ...t, title: newTitle } : t)),
            };
        }
        case 'ADD-TODOLIST': {
            return { ...state, [action.payload.todolist.id]: [] };
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = { ...state };
            delete stateCopy[action.payload.id];
            return stateCopy;
        }
        case 'SET-TODOLIST': {
            const stateCopy = { ...state };
            action.payload.todolists.forEach((tl) => {
                stateCopy[tl.id] = [];
            });
            return stateCopy;
        }
        case 'SET_TASKS': {
            const stateCopy = { ...state };
            stateCopy[action.payload.todolistId] = action.payload.tasks;
            return stateCopy;
        }
        default:
            return state;
    }
};

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskACActionType => {
    return {
        type: 'REMOVE_TASK',
        payload: {
            taskId,
            todolistId,
        },
    } as const;
};

export const addTaskAC = (task: TaskType): AddTaskACActionType => {
    return {
        type: 'ADD_TASK',
        payload: {
            task,
        },
    } as const;
};

export const updateTaskAC = (
    taskId: string,
    model: UpdateDomainTaskModelType,
    todolistId: string,
): UpdateTaskACActionType => {
    return {
        type: 'UPDATE_TASK',
        payload: {
            taskId,
            model,
            todolistId,
        },
    } as const;
};

export const changeTaskTitleAC = (
    taskId: string,
    newTitle: string,
    todolistId: string,
): ChangeTaskTitleACActionType => {
    return {
        type: 'CHANGE_TASK_TITLE',
        payload: {
            taskId,
            newTitle,
            todolistId,
        },
    } as const;
};

export const setTasksAC = (tasks: TaskType[], todolistId: string): setTasksActionType => {
    return {
        type: 'SET_TASKS',
        payload: {
            tasks,
            todolistId,
        },
    };
};

export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTasks(todolistId).then((res) => {
            const action = setTasksAC(res.data.items, todolistId);
            dispatch(action);
        });
    };
};

export const removeTaskTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTasks(todolistId, taskId).then((res) => {
            dispatch(removeTaskAC(taskId, todolistId));
        });
    };
};

export const addTaskTC = (title: string, todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTask(todolistId, title).then((res) => {
            dispatch(addTaskAC(res.data.data.item));
        });
    };
};

export type UpdateDomainTaskModelType = {
    description?: string;
    title?: string;
    status?: number;
    priority?: number;
    startDate?: string;
    deadline?: string;
};

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
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
};
