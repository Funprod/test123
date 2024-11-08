import { TodoList } from './../TodoList';
import { v1 } from 'uuid';
import { todolistsAPI, TodolistType } from '../api/todolists-api';
import { Dispatch } from 'redux';

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST';
    payload: {
        id: string;
    };
};

export type AddTodolistActionType = {
    type: 'ADD-TODOLIST';
    payload: {
        todolist: TodolistType;
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
export type SetTodolistsActionType = {
    type: 'SET-TODOLIST';
    payload: { todolists: TodolistType[] };
};

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType;

const initialState: TodolistDomainType[] = [];
export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
};

export const todolistsReducer = (
    state: TodolistDomainType[] = initialState,
    action: ActionsType,
): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter((tl) => tl.id !== action.payload.id);
        }
        case 'ADD-TODOLIST': {
            const newTodolist: TodolistDomainType = { ...action.payload.todolist, filter: 'all' };
            return [newTodolist, ...state];
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
        case 'SET-TODOLIST': {
            return action.payload.todolists.map((tl) => {
                return {
                    ...tl,
                    filter: 'all',
                };
            });
        }
        default:
            return state;
    }
};

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', payload: { id: todolistId } } as const;
};

export const addTodolistAC = (todolist: TodolistType): AddTodolistActionType => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            todolist,
        },
    } as const;
};

export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: { id: id, title: title },
    } as const;
};

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: { id: id, filter: filter },
    } as const;
};

export const setTodolistAC = (todolists: TodolistType[]): SetTodolistsActionType => {
    return {
        type: 'SET-TODOLIST',
        payload: { todolists },
    } as const;
};

export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTodolists().then((res) => {
            const action = setTodolistAC(res.data);
            dispatch(action);
        });
    };
};

export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            dispatch(removeTodolistAC(todolistId));
        });
    };
};

export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(addTodolistAC(res.data.data.item));
        });
    };
};

export const changeTodolistTitleTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.updateTodolists(todolistId, title).then((res) => {
            dispatch(changeTodolistTitleAC(todolistId, title));
        });
    };
};
