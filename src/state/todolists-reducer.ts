import { v1 } from 'uuid';
import { FilterValuesType, TodoListType } from '../App';

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST';
    payload: {
        id: string;
    };
};

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST';
    payload: {
        title: string;
    };
};

export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE';
    payload: {
        id: string;
        title: string;
    };
};

export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER';
    payload: {
        id: string;
        filter: FilterValuesType;
    };
};

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType;

export const todolistsReducer = (
    state: TodoListType[],
    action: ActionsType,
): TodoListType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter((tl) => tl.id !== action.payload.id);
        }
        case 'ADD-TODOLIST': {
            return [
                ...state,
                { id: v1(), title: action.payload.title, filter: 'all' },
            ];
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todoList = state.find((tl) => tl.id === action.payload.id);
            if (todoList) {
                todoList.title = action.payload.title;
            }
            return [...state];
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todoList = state.find((tl) => tl.id === action.payload.id);
            if (todoList) {
                todoList.filter = action.payload.filter;
            }
            return [...state];
        }

        default:
            throw new Error("I don't understand this type");
    }
};

export const removeTodolistAC = (
    todolistId: string,
): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', payload: { id: todolistId } } as const;
};

export const addTodolistAC = (title: string): AddTodolistActionType => {
    return { type: 'ADD-TODOLIST', payload: { title: title } } as const;
};

export const changeTodolistTitleAC = (
    id: string,
    title: string,
): ChangeTodolistTitleActionType => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: { id: id, title: title },
    } as const;
};

export const changeTodolistFilterAC = (
    id: string,
    filter: FilterValuesType,
): ChangeTodolistFilterActionType => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: { id: id, filter: filter },
    } as const;
};
