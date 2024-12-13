import React, { useCallback, useEffect } from 'react';
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
} from './todolists-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Grid, Paper } from '@mui/material';
import { AddItemForm } from '../../components/AddItemForm/AddItemForm';
import { TodoList } from './Todolist/TodoList';
import { RootState } from '../../app/store';

type PropsType = {
    demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todoLists = useSelector<RootState, TodolistDomainType[]>((state) => state.todolists);
    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

    useEffect(() => {
        if (demo) return;
        dispatch(fetchTodolistsTC());
    }, []);

    const changeFilter = useCallback(
        (value: FilterValuesType, todoListId: string) => {
            dispatch(changeTodolistFilterAC({ id: todoListId, filter: value }));
        },
        [dispatch],
    );

    const removeTodoList = useCallback(
        (todolistId: string) => {
            dispatch(removeTodolistTC({ todolistId }));
        },
        [dispatch],
    );
    const changeTodoListTitle = useCallback(
        (todolistId: string, newTitle: string) => {
            // dispatch(changeTodolistTitleAC(todoListId, newTitle));
            dispatch(changeTodolistTitleTC({ todolistId, title: newTitle }));
        },
        [dispatch],
    );

    const addTodolist = useCallback(
        (title: string) => {
            dispatch(addTodolistTC({ title }));
        },
        [dispatch],
    );
    return (
        <>
            <Grid container style={{ padding: '20px' }}>
                <AddItemForm addItem={addTodolist} />
            </Grid>
            <Grid container spacing={3}>
                {todoLists.map((tl) => {
                    return (
                        <Grid key={tl.id} item>
                            <Paper style={{ padding: '20px' }}>
                                <TodoList
                                    todolist={tl}
                                    demo={demo}
                                    changeFilter={changeFilter}
                                    removeTodoList={removeTodoList}
                                    changeTodoListTitle={changeTodoListTitle}
                                />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
