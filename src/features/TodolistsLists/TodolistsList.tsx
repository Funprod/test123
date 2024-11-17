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

type TodolistsListPropsType = {
    todolists: TodolistDomainType[];
};

export const TodolistsList: React.FC = () => {
    const todoLists = useSelector<RootState, TodolistDomainType[]>((state) => state.todolists);
    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTC());
    }, []);

    const changeFilter = useCallback(
        (value: FilterValuesType, todoListId: string) => {
            dispatch(changeTodolistFilterAC(todoListId, value));
        },
        [dispatch],
    );

    const removeTodoList = useCallback(
        (todoListId: string) => {
            dispatch(removeTodolistTC(todoListId));
        },
        [dispatch],
    );
    const changeTodoListTitle = useCallback(
        (todoListId: string, newTitle: string) => {
            // dispatch(changeTodolistTitleAC(todoListId, newTitle));
            dispatch(changeTodolistTitleTC(todoListId, newTitle));
        },
        [dispatch],
    );

    const addTodolist = useCallback(
        (title: string) => {
            dispatch(addTodolistTC(title));
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
                                    id={tl.id}
                                    title={tl.title}
                                    changeFilter={changeFilter}
                                    filter={tl.filter}
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
