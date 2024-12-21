import React, { useCallback, useEffect } from 'react';
import { TodolistDomainType } from './todolists-reducer';
import { useSelector } from 'react-redux';
import { Grid, Paper } from '@mui/material';
import { AddItemForm, HelperType } from '../../components/AddItemForm/AddItemForm';
import { TodoList } from './Todolist/TodoList';
import { RootState, useActions, useAppDispatch } from '../../app/store';
import { selectIsLoggedIn } from '../Auth/selectors';
import { todolistsActions } from '.';

type PropsType = {
    demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todoLists = useSelector<RootState, TodolistDomainType[]>((state) => state.todolists);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { addTodolist, fetchTodolists } = useActions(todolistsActions);
    const dispatch = useAppDispatch();

    const addTodolistCallback = useCallback(async (title: string, helper: HelperType) => {
        addTodolist(title);
        let thunk = todolistsActions.addTodolist(title);
        const resultAction = await dispatch(thunk);
        if (todolistsActions.addTodolist.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage: any = resultAction.payload?.errors[0];
                helper.setError(errorMessage);
            } else {
                helper.setError('some error occurred');
            }
        } else {
            helper.setTitle('');
        }
    }, []);

    useEffect(() => {
        if (demo || !isLoggedIn) return;
        fetchTodolists();
    }, []);

    return (
        <>
            <Grid container style={{ padding: '20px' }}>
                <AddItemForm addItem={addTodolistCallback} />
            </Grid>
            <Grid container spacing={3} style={{ flexWrap: 'nowrap', overflowX: 'scroll' }}>
                {todoLists.map((tl) => {
                    return (
                        <Grid key={tl.id} item>
                            <div style={{ width: '300px' }}>
                                <TodoList todolist={tl} demo={demo} />
                            </div>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
