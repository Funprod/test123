import React, { useEffect } from 'react';
import { TodolistDomainType } from './todolists-reducer';
import { useSelector } from 'react-redux';
import { Grid, Paper } from '@mui/material';
import { AddItemForm } from '../../components/AddItemForm/AddItemForm';
import { TodoList } from './Todolist/TodoList';
import { RootState, useActions } from '../../app/store';
import { selectIsLoggedIn } from '../Auth/selectors';
import { todolistsActions } from '.';

type PropsType = {
    demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todoLists = useSelector<RootState, TodolistDomainType[]>((state) => state.todolists);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { addTodolist, fetchTodolists } = useActions(todolistsActions);

    useEffect(() => {
        if (demo || !isLoggedIn) return;
        fetchTodolists();
    }, []);

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
                                <TodoList todolist={tl} demo={demo} />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};
