import React, { ChangeEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Checkbox, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { TaskStatuses, TaskType } from '../../../../api/todolists-api';
import { EditableSpan } from '../../../../components/EditableSpan/EditableSpan';
import { removeTaskTC, updateTaskTC } from '../../tasks-reducer';
import { RequestStatusType } from '../../../../app/app-reducer';

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

    const changeTaskStatus = useCallback(
        (e: ChangeEvent<HTMLInputElement>) =>
            dispatch(
                updateTaskTC({
                    taskId: props.task.id,
                    domainModel: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New },
                    todolistId: props.todolistId,
                }),
            ),
        [props.task.id, props.todolistId],
    );

    const changeTaskTitle = useCallback(
        (newTitle: string) =>
            dispatch(
                updateTaskTC({ taskId: props.task.id, domainModel: { title: newTitle }, todolistId: props.todolistId }),
            ),
        [props.task.id, props.todolistId],
    );

    const removeTask = useCallback(
        () => dispatch(removeTaskTC({ todolistId: props.todolistId, taskId: props.task.id })),
        [props.task.id, props.todolistId],
    );

    return (
        <li key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
            <Checkbox
                checked={props.task.status === TaskStatuses.Completed}
                onChange={changeTaskStatus}
                disabled={props.entityStatus === 'loading'}
            />
            <EditableSpan
                title={props.task.title}
                onChange={changeTaskTitle}
                disabled={props.entityStatus === 'loading'}
            />
            <IconButton onClick={removeTask} disabled={props.entityStatus === 'loading'}>
                <Delete />
            </IconButton>
        </li>
    );
});

type TaskPropsType = {
    todolistId: string;
    task: TaskType;
    entityStatus: RequestStatusType;
};
