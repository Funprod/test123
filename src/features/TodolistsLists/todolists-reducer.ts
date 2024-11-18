import { todolistsAPI, TodolistType } from '../../api/todolists-api';
import { Dispatch } from 'redux';
import { RequestStatusType, setStatusAC, SetStatusActionType } from '../../app/app-reducer';

const initialState: TodolistDomainType[] = [];

export const todolistsReducer = (
    state: TodolistDomainType[] = initialState,
    action: ActionsType,
): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter((tl) => tl.id !== action.payload.id);
        case 'ADD-TODOLIST':
            return [{ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' }, ...state];
        case 'CHANGE-TODOLIST-TITLE':
            return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl));
        case 'CHANGE-TODOLIST-FILTER':
            return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl));
        case 'SET-TODOLIST':
            return action.payload.todolists.map((tl) => ({ ...tl, filter: 'all', entityStatus: 'idle' }));
        default:
            return state;
    }
};
// Actions
export const removeTodolistAC = (id: string) => ({ type: 'REMOVE-TODOLIST', payload: { id } }) as const;
export const addTodolistAC = (todolist: TodolistType) => ({ type: 'ADD-TODOLIST', payload: { todolist } }) as const;
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({ type: 'CHANGE-TODOLIST-TITLE', payload: { id, title: title } }) as const;
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({ type: 'CHANGE-TODOLIST-FILTER', payload: { id: id, filter: filter } }) as const;
export const setTodolistAC = (todolists: TodolistType[]) => ({ type: 'SET-TODOLIST', payload: { todolists } }) as const;

// Thunks
export const fetchTodolistsTC = () => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.getTodolists().then((res) => {
            const action = setTodolistAC(res.data);
            dispatch(action);
            dispatch(setStatusAC('succeeded'));
        });
    };
};
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            dispatch(removeTodolistAC(todolistId));
            dispatch(setStatusAC('succeeded'));
        });
    };
};
export const addTodolistTC = (title: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(addTodolistAC(res.data.data.item));
            dispatch(setStatusAC('succeeded'));
        });
    };
};
export const changeTodolistTitleTC = (todolistId: string, title: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setStatusAC('loading'));
        todolistsAPI.updateTodolists(todolistId, title).then((res) => {
            dispatch(changeTodolistTitleAC(todolistId, title));
            dispatch(setStatusAC('succeeded'));
        });
    };
};

// Types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistAC>;

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType;

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
type ThunkDispatch = Dispatch<ActionsType | SetStatusActionType>;
