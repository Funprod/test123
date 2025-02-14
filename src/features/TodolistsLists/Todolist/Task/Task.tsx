import React, { ChangeEvent, useCallback } from 'react';
import { Checkbox, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TaskStatuses, TaskType } from '../../../../api/todolists-api';
import { EditableSpan } from '../../../../components/EditableSpan/EditableSpan';
import { RequestStatusType } from '../../../../features/App/app-reducer';

import { tasksActions } from '../..';
import { useActions } from '../../../../utils/redux-utils';

export const Task = React.memo((props: TaskPropsType) => {
    const { removeTask, updateTask } = useActions(tasksActions);

    const changeTaskStatus = useCallback(
        (e: ChangeEvent<HTMLInputElement>) =>
            updateTask({
                taskId: props.task.id,
                domainModel: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New },
                todolistId: props.todolistId,
            }),
        [props.task.id, props.todolistId],
    );

    const changeTaskTitle = useCallback(
        (newTitle: string) =>
            updateTask({ taskId: props.task.id, domainModel: { title: newTitle }, todolistId: props.todolistId }),
        [props.task.id, props.todolistId],
    );

    const removeTaskCallback = useCallback(
        () => removeTask({ todolistId: props.todolistId, taskId: props.task.id }),
        [props.task.id, props.todolistId],
    );

    return (
        <li
            key={props.task.id}
            className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}
            style={{ position: 'relative' }}
        >
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
            <IconButton
                onClick={removeTaskCallback}
                disabled={props.entityStatus === 'loading'}
                style={{ position: 'absolute', top: '2px', right: '2px' }}
            >
                <Delete fontSize={'small'} />
            </IconButton>
        </li>
    );
});

type TaskPropsType = {
    todolistId: string;
    task: TaskType;
    entityStatus: RequestStatusType;
};
