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

export const setAppErrorAC = (error: string | null) =>
    ({
        type: 'APP/SET_ERROR',
        error,
    }) as const;

export const setAppStatusAC = (status: RequestStatusType) =>
    ({
        type: 'APP/SET_STATUS',
        status,
    }) as const;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';

export type InitialStateType = {
    status: RequestStatusType;
    error: string | null;
};

export type SetErrorAppActionType = ReturnType<typeof setAppErrorAC>;
export type SetStatusAppActionType = ReturnType<typeof setAppStatusAC>;

type ActionsType = SetErrorAppActionType | SetStatusAppActionType;
