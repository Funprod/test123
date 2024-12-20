import React, { useCallback, useEffect } from 'react';
import { Button, ButtonOwnProps, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { FilterValuesType, TodolistDomainType } from '../todolists-reducer';
import { TaskStatuses, TaskType } from '../../../api/todolists-api';
import { AddItemForm } from '../../../components/AddItemForm/AddItemForm';
import { EditableSpan } from '../../../components/EditableSpan/EditableSpan';
import { Task } from './Task/Task';
import { RootState, useActions } from '../../../app/store';
import { tasksActions, todolistsActions } from '..';

type PropsType = {
    todolist: TodolistDomainType;
    demo?: boolean;
};

export const TodoList = React.memo(({ demo = false, ...props }: PropsType) => {
    console.log('Todo is call');

    const tasks = useSelector<RootState, TaskType[]>((state) => state.tasks[props.todolist.id]);

    const { addTask, fetchTasks } = useActions(tasksActions);
    const { changeTodolistFilter, removeTodolist, changeTodolistTitle } = useActions(todolistsActions);

    useEffect(() => {
        if (demo) return;
        fetchTasks(props.todolist.id);
    }, []);

    const addTaskCallback = useCallback(
        (title: string) => {
            addTask({ title, todolistId: props.todolist.id });
        },
        [props.todolist.id],
    );

    const onFilterButtonClickHandler = useCallback(
        (filter: FilterValuesType) => changeTodolistFilter({ filter, id: props.todolist.id }),
        [props.todolist.id],
    );

    const removeTodoList = useCallback(() => {
        removeTodolist({ todolistId: props.todolist.id });
    }, [props.todolist.id]);

    const changeTodoListTitle = useCallback(
        (newTitle: string) => {
            changeTodolistTitle({ todolistId: props.todolist.id, title: newTitle });
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

    const renderFilterButton = (buttonFilter: FilterValuesType, text: string, color?: ButtonOwnProps['color']) => {
        return (
            <Button
                color={color}
                variant={props.todolist.filter === buttonFilter ? 'contained' : 'text'}
                onClick={() => onFilterButtonClickHandler(buttonFilter)}
            >
                {text}
            </Button>
        );
    };

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
            <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'} />
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
                {renderFilterButton('all', 'All')}
                {renderFilterButton('active', 'Active', 'primary')}
                {renderFilterButton('completed', 'Completed', 'secondary')}
            </div>
        </div>
    );
});
