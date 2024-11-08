import React, { useCallback, useEffect } from 'react';
import { AddItemForm } from './AddItemForm';
import { EditableSpan } from './EditableSpan';
import { Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './state/store';
import { addTaskAC, addTaskTC, fetchTasksTC } from './state/tasks-reducer';
import { Task } from './Task';
import { TaskStatuses, TaskType } from './api/todolists-api';
import { FilterValuesType } from './state/todolists-reducer';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

type PropsType = {
    id: string;
    title: string;
    changeFilter: (value: FilterValuesType, todoListId: string) => void;
    removeTodoList: (todoListId: string) => void;
    changeTodoListTitle: (todoListId: string, newTitle: string) => void;
    filter: FilterValuesType;
};

export const TodoList = React.memo((props: PropsType) => {
    console.log('Todo is call');

    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

    const tasks = useSelector<RootState, TaskType[]>((state) => state.tasks[props.id]);

    useEffect(() => {
        dispatch(fetchTasksTC(props.id));
    }, []);

    const addTask = useCallback(
        (title: string) => {
            dispatch(addTaskTC(title, props.id));
        },
        [props.id],
    );

    const onAllClickHandler = useCallback(() => props.changeFilter('all', props.id), [props.changeFilter, props.id]);
    const onActiveClickHandler = useCallback(
        () => props.changeFilter('active', props.id),
        [props.changeFilter, props.id],
    );
    const onCompletedClickHandler = useCallback(
        () => props.changeFilter('completed', props.id),
        [props.changeFilter, props.id],
    );

    const removeTodoList = useCallback(() => {
        props.removeTodoList(props.id);
    }, [props.id]);

    const changeTodoListTitle = useCallback(
        (newTitle: string) => {
            props.changeTodoListTitle(props.id, newTitle);
        },
        [props.id],
    );

    let tasksForTodoList = tasks;

    if (props.filter === 'completed') {
        tasksForTodoList = tasksForTodoList.filter((t) => t.status === TaskStatuses.Completed);
    }
    if (props.filter === 'active') {
        tasksForTodoList = tasksForTodoList.filter((t) => t.status === TaskStatuses.New);
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={changeTodoListTitle} />
                <IconButton onClick={removeTodoList}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} />
            <ul>
                {tasksForTodoList.map((t) => (
                    <Task task={t} todolistId={props.id} key={t.id} />
                ))}
            </ul>
            <div>
                <Button variant={props.filter === 'all' ? 'contained' : 'text'} onClick={onAllClickHandler}>
                    All
                </Button>
                <Button
                    color={'primary'}
                    variant={props.filter === 'active' ? 'contained' : 'text'}
                    onClick={onActiveClickHandler}
                >
                    Active
                </Button>
                <Button
                    color={'secondary'}
                    variant={props.filter === 'completed' ? 'contained' : 'text'}
                    onClick={onCompletedClickHandler}
                >
                    Completed
                </Button>
            </div>
        </div>
    );
});
