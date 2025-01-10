import { useDispatch } from 'react-redux';
import store from '../app/store';
import { ActionCreatorsMapObject, bindActionCreators } from 'redux';
import { useMemo } from 'react';

type AppDispatchType = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatchType>();

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useAppDispatch();

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch);
    }, []);
    return boundActions;
}
