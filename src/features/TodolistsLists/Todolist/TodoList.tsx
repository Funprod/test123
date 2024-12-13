import React, { useCallback, useEffect } from 'react';
import { Button, CircularProgress, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { FilterValuesType, TodolistDomainType } from '../todolists-reducer';

import { TaskStatuses, TaskType } from '../../../api/todolists-api';

import { AddItemForm } from '../../../components/AddItemForm/AddItemForm';
import { EditableSpan } from '../../../components/EditableSpan/EditableSpan';
import { Task } from './Task/Task';
import { RootState } from '../../../app/store';
import { addTaskTC, fetchTasksTC } from '../tasks-reducer';
import { Navigate, Route } from 'react-router-dom';

type PropsType = {
    todolist: TodolistDomainType;
    changeFilter: (value: FilterValuesType, todoListId: string) => void;
    removeTodoList: (todoListId: string) => void;
    changeTodoListTitle: (todoListId: string, newTitle: string) => void;
    demo?: boolean;
};

export const TodoList = React.memo(({ demo = false, ...props }: PropsType) => {
    console.log('Todo is call');

    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

    const tasks = useSelector<RootState, TaskType[]>((state) => state.tasks[props.todolist.id]);

    useEffect(() => {
        if (demo) return;
        dispatch(fetchTasksTC(props.todolist.id));
    }, []);

    const addTask = useCallback(
        (title: string) => {
            dispatch(addTaskTC({ title, todolistId: props.todolist.id }));
        },
        [props.todolist.id],
    );

    const onAllClickHandler = useCallback(
        () => props.changeFilter('all', props.todolist.id),
        [props.changeFilter, props.todolist.id],
    );
    const onActiveClickHandler = useCallback(
        () => props.changeFilter('active', props.todolist.id),
        [props.changeFilter, props.todolist.id],
    );
    const onCompletedClickHandler = useCallback(
        () => props.changeFilter('completed', props.todolist.id),
        [props.changeFilter, props.todolist.id],
    );

    const removeTodoList = useCallback(() => {
        props.removeTodoList(props.todolist.id);
    }, [props.todolist.id]);

    const changeTodoListTitle = useCallback(
        (newTitle: string) => {
            props.changeTodoListTitle(props.todolist.id, newTitle);
        },
        [props.todolist.id],
    );

    let tasksForTodoList = tasks;

    if (props.todolist.filter === 'completed') {
        tasksForTodoList = tasksForTodoList.filter((t) => t.status === TaskStatuses.Completed);
    }
    if (props.todolist.filter === 'active') {
        tasksForTodoList = tasksForTodoList.filter((t) => t.status === TaskStatuses.New);
    }
    return (
        <div>
            <h3>
                <EditableSpan
                    title={props.todolist.title}
                    onChange={changeTodoListTitle}
                    disabled={props.todolist.entityStatus === 'loading'}
                />
                <IconButton onClick={removeTodoList} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'} />
            <ul>
                {tasksForTodoList.map((t) => (
                    <Task
                        task={t}
                        todolistId={props.todolist.id}
                        key={t.id}
                        entityStatus={props.todolist.entityStatus}
                    />
                ))}
            </ul>
            <div>
                <Button variant={props.todolist.filter === 'all' ? 'contained' : 'text'} onClick={onAllClickHandler}>
                    All
                </Button>
                <Button
                    color={'primary'}
                    variant={props.todolist.filter === 'active' ? 'contained' : 'text'}
                    onClick={onActiveClickHandler}
                >
                    Active
                </Button>
                <Button
                    color={'secondary'}
                    variant={props.todolist.filter === 'completed' ? 'contained' : 'text'}
                    onClick={onCompletedClickHandler}
                >
                    Completed
                </Button>
            </div>
        </div>
    );
});
