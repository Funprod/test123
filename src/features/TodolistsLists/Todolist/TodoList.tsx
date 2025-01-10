import React, { useCallback, useEffect } from 'react';
import { Button, ButtonOwnProps, IconButton, Paper } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { FilterValuesType, TodolistDomainType } from '../todolists-reducer';
import { TaskStatuses, TaskType } from '../../../api/todolists-api';
import { AddItemForm, HelperType } from '../../../components/AddItemForm/AddItemForm';
import { EditableSpan } from '../../../components/EditableSpan/EditableSpan';
import { Task } from './Task/Task';
import { RootState } from '../../../app/store';
import { tasksActions, todolistsActions } from '..';
import { useActions, useAppDispatch } from '../../../utils/redux-utils';

type PropsType = {
    todolist: TodolistDomainType;
    demo?: boolean;
};

export const TodoList = React.memo(({ demo = false, ...props }: PropsType) => {
    console.log('Todo is call');

    const tasks = useSelector<RootState, TaskType[]>((state) => state.tasks[props.todolist.id]);

    const { fetchTasks } = useActions(tasksActions);
    const { changeTodolistFilter, removeTodolist, changeTodolistTitle } = useActions(todolistsActions);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (demo) return;
        fetchTasks(props.todolist.id);
    }, []);

    const addTaskCallback = useCallback(
        async (title: string, helper: HelperType) => {
            let thunk = tasksActions.addTask({ title, todolistId: props.todolist.id });
            const resultAction = await dispatch(thunk);
            if (tasksActions.addTask.rejected.match(resultAction)) {
                if (resultAction.payload?.errors?.length) {
                    const errorMessage: any = resultAction.payload?.errors[0];
                    helper.setError(errorMessage);
                } else {
                    helper.setError('some error occurred');
                }
            } else {
                helper.setTitle('');
            }
        },
        [dispatch, props.todolist.id],
    );

    const onFilterButtonClickHandler = useCallback(
        (filter: FilterValuesType) => changeTodolistFilter({ filter, id: props.todolist.id }),
        [changeTodolistFilter, props.todolist.id],
    );

    const removeTodoList = useCallback(() => {
        removeTodolist({ todolistId: props.todolist.id });
    }, [props.todolist.id, removeTodolist]);

    const changeTodoListTitle = useCallback(
        (newTitle: string) => {
            changeTodolistTitle({ todolistId: props.todolist.id, title: newTitle });
        },
        [changeTodolistTitle, props.todolist.id],
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
        <Paper style={{ padding: '10px', position: 'relative' }}>
            <h3>
                <EditableSpan
                    title={props.todolist.title}
                    onChange={changeTodoListTitle}
                    disabled={props.todolist.entityStatus === 'loading'}
                />
            </h3>
            <IconButton
                size={'small'}
                onClick={removeTodoList}
                disabled={props.todolist.entityStatus === 'loading'}
                style={{ position: 'absolute', right: '5px', top: '5px' }}
            >
                <Delete fontSize={'small'} />
            </IconButton>
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
                {!tasksForTodoList.length && <span style={{ color: 'gray' }}>No task</span>}
            </ul>
            <div>
                {renderFilterButton('all', 'All')}
                {renderFilterButton('active', 'Active', 'primary')}
                {renderFilterButton('completed', 'Completed', 'secondary')}
            </div>
        </Paper>
    );
});
