import React, { useCallback, useEffect } from 'react';
import './App.css';
import { TodoList } from './TodoList';
import { AddItemForm } from './AddItemForm';
import { AppBar, Button, Container, Grid, IconButton, Paper, Toolbar } from '@mui/material';
import { Menu } from '@mui/icons-material';
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
} from './state/todolists-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './state/store';
import { TaskType } from './api/todolists-api';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

export type TaskStateType = {
    [key: string]: TaskType[];
};

function AppWithRedux() {
    console.log('App is called');

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
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit">
                        <Menu />
                    </IconButton>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
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
            </Container>
        </div>
    );
}

export default AppWithRedux;
