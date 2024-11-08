import React, { ChangeEvent, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { updateTaskAC, changeTaskTitleAC, removeTaskAC, removeTaskTC, updateTaskTC } from './state/tasks-reducer';
import { Checkbox, IconButton } from '@mui/material';
import { EditableSpan } from './EditableSpan';
import { Delete } from '@mui/icons-material';
import { TaskStatuses, TaskType, todolistsAPI } from './api/todolists-api';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

    const changeTaskStatus = useCallback(
        (e: ChangeEvent<HTMLInputElement>) =>
            dispatch(
                updateTaskTC(
                    props.task.id,
                    { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New },
                    props.todolistId,
                ),
            ),
        [props.task.id, props.todolistId],
    );

    const changeTaskTitle = useCallback(
        (newTitle: string) => dispatch(updateTaskTC(props.task.id, { title: newTitle }, props.todolistId)),
        [props.task.id, props.todolistId],
    );

    const removeTask = useCallback(
        () => dispatch(removeTaskTC(props.todolistId, props.task.id)),
        [props.task.id, props.todolistId],
    );

    return (
        <li key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox checked={props.task.status === TaskStatuses.Completed} onChange={changeTaskStatus} />
            <EditableSpan title={props.task.title} onChange={changeTaskTitle} />
            <IconButton onClick={removeTask}>
                <Delete />
            </IconButton>
        </li>
    );
});

type TaskPropsType = {
    todolistId: string;
    task: TaskType;
};
