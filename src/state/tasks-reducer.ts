import { v1 } from 'uuid';
import { FilterValuesType, TaskStateType } from '../App';
import {
    AddTodolistActionType,
    RemoveTodolistActionType,
} from './todolists-reducer';

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
        title: string;
        todolistId: string;
    };
};

export type ChangeTaskStatusACActionType = {
    type: 'CHANGE_TASK_STATUS';
    payload: {
        taskId: string;
        isDone: boolean;
        todolistId: string;
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

type ActionsType =
    | RemoveTaskACActionType
    | AddTaskACActionType
    | ChangeTaskStatusACActionType
    | ChangeTaskTitleACActionType
    | AddTodolistActionType
    | RemoveTodolistActionType;

export const tasksReducer = (
    state: TaskStateType,
    action: ActionsType,
): TaskStateType => {
    switch (action.type) {
        case 'REMOVE_TASK': {
            const stateCopy = { ...state };
            const tasks = state[action.payload.todolistId];
            const filteredTasks = tasks.filter(
                (t) => t.id !== action.payload.taskId,
            );
            stateCopy[action.payload.todolistId] = filteredTasks;
            return stateCopy;
        }
        case 'ADD_TASK': {
            const stateCopy = { ...state };
            const tasks = stateCopy[action.payload.todolistId];
            const newTasks = [
                { id: v1(), title: action.payload.title, isDone: false },
                ...tasks,
            ];
            stateCopy[action.payload.todolistId] = newTasks;
            return stateCopy;
        }
        case 'CHANGE_TASK_STATUS': {
            const { taskId, isDone, todolistId } = action.payload;
            return {
                ...state,
                [todolistId]: state[todolistId].map((t) =>
                    t.id === taskId ? { ...t, isDone } : t,
                ),
            };
        }
        case 'CHANGE_TASK_TITLE': {
            const { taskId, newTitle, todolistId } = action.payload;
            return {
                ...state,
                [todolistId]: state[todolistId].map((t) =>
                    t.id === taskId ? { ...t, title: newTitle } : t,
                ),
            };
        }
        case 'ADD-TODOLIST': {
            return { ...state, [action.payload.todolistId]: [] };
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = { ...state };
            delete stateCopy[action.payload.id];
            return stateCopy;
        }
        default:
            return state;
    }
};

export const removeTaskAC = (
    taskId: string,
    todolistId: string,
): RemoveTaskACActionType => {
    return {
        type: 'REMOVE_TASK',
        payload: {
            taskId,
            todolistId,
        },
    } as const;
};

export const addTaskAC = (
    title: string,
    todolistId: string,
): AddTaskACActionType => {
    return {
        type: 'ADD_TASK',
        payload: {
            title,
            todolistId,
        },
    } as const;
};

export const changeTaskStatusAC = (
    taskId: string,
    isDone: boolean,
    todolistId: string,
): ChangeTaskStatusACActionType => {
    return {
        type: 'CHANGE_TASK_STATUS',
        payload: {
            taskId,
            isDone,
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
