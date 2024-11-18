import { todolistsAPI, TodolistType } from '../../api/todolists-api';
import { Dispatch } from 'redux';
import { RequestStatusType, setAppStatusAC, SetStatusAppActionType } from '../../app/app-reducer';
import { handleServerAppError, handleServerNetworkError } from '../../utils/error-utils';

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
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map((tl) =>
                tl.id === action.payload.id ? { ...tl, entityStatus: action.payload.status } : tl,
            );
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
    ({ type: 'CHANGE-TODOLIST-TITLE', payload: { id, title } }) as const;
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({ type: 'CHANGE-TODOLIST-FILTER', payload: { id, filter } }) as const;
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
    ({ type: 'CHANGE-TODOLIST-ENTITY-STATUS', payload: { id, status } }) as const;
export const setTodolistAC = (todolists: TodolistType[]) => ({ type: 'SET-TODOLIST', payload: { todolists } }) as const;

// Thunks
export const fetchTodolistsTC = () => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC('loading'));
        todolistsAPI.getTodolists().then((res) => {
            const action = setTodolistAC(res.data);
            dispatch(action);
            dispatch(setAppStatusAC('succeeded'));
        });
    };
};
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC('loading'));
        dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'));
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            dispatch(removeTodolistAC(todolistId));
            dispatch(setAppStatusAC('succeeded'));
        });
    };
};
export const addTodolistTC = (title: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC('loading'));
        todolistsAPI
            .createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item));
                    dispatch(setAppStatusAC('succeeded'));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            });
    };
};
export const changeTodolistTitleTC = (todolistId: string, title: string) => {
    return (dispatch: ThunkDispatch) => {
        dispatch(setAppStatusAC('loading'));
        todolistsAPI
            .updateTodolists(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTodolistTitleAC(todolistId, title));
                    dispatch(setAppStatusAC('succeeded'));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            });
    };
};

// Types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistAC>;
export type ChangeTodolistEntityStatusAT = ReturnType<typeof changeTodolistEntityStatusAC>;

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | SetTodolistsActionType
    | ChangeTodolistEntityStatusAT;

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};

type ThunkDispatch = Dispatch<ActionsType | SetStatusAppActionType>;
