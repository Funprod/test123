import React, { ChangeEvent, useState } from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import { ControlPoint } from '@mui/icons-material';

type AddItemFormPropsType = {
    addItem: (title: string) => void;
    disabled?: boolean;
};

export const AddItemForm = React.memo(({ disabled = false, ...props }: AddItemFormPropsType) => {
    console.log('AddItemForm');

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTaskTitle(e.currentTarget.value);
    };
    const keyDownHandler = (e: React.KeyboardEvent<HTMLElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (newTaskTitle.trim() === '') {
            // return setError('Title is required');
        }
        if (e.key === 'Enter') {
            props.addItem(newTaskTitle);
            setNewTaskTitle('');
        }
    };
    const addTask = () => {
        if (newTaskTitle.trim() !== '') {
            props.addItem(newTaskTitle.trim());
            setNewTaskTitle('');
        } else {
            // setError('Title is required');
        }
    };
    return (
        <div>
            <TextField
                disabled={disabled}
                value={newTaskTitle}
                variant={'outlined'}
                label={'Type value'}
                onChange={onNewTitleChangeHandler}
                onKeyDown={keyDownHandler}
                error={!!error}
                helperText={error}
            />
            <IconButton onClick={addTask} color={'primary'} disabled={disabled}>
                <ControlPoint />
            </IconButton>
        </div>
    );
});
