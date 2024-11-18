const initialState: InitialStateType = {
    status: 'idle',
    error: null,
};

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET_STATUS':
            return { ...state, status: action.status };
        case 'APP/SET_ERROR':
            return { ...state, error: action.error };
        default:
            return { ...state };
    }
};

export const setErrorAC = (error: string | null) =>
    ({
        type: 'APP/SET_ERROR',
        error,
    }) as const;

export const setStatusAC = (status: RequestStatusType) =>
    ({
        type: 'APP/SET_STATUS',
        status,
    }) as const;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type InitialStateType = {
    status: RequestStatusType;
    error: string | null;
};

export type SetErrorActionType = ReturnType<typeof setErrorAC>;
export type SetStatusActionType = ReturnType<typeof setStatusAC>;

type ActionsType = SetErrorActionType | SetStatusActionType;
