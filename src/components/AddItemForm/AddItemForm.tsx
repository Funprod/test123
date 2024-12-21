import React, { ChangeEvent, useState } from 'react';
import { Button, IconButton, TextField } from '@mui/material';
import { ControlPoint } from '@mui/icons-material';

export type HelperType = {
    setError: (error: string) => void;
    setTitle: (title: string) => void;
};

type AddItemFormPropsType = {
    addItem: (title: string, helper: HelperType) => void;
    disabled?: boolean;
};

export const AddItemForm = React.memo(({ addItem, disabled = false, ...props }: AddItemFormPropsType) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };
    const keyDownHandler = (e: React.KeyboardEvent<HTMLElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (title.trim() === '') {
            return setError('Title is required');
        }
        if (e.key === 'Enter') {
            addItem(title, { setError, setTitle });
            setTitle('');
        }
    };
    const addItemHandler = async () => {
        if (title.trim() !== '') {
            addItem(title.trim(), { setError, setTitle });
            // setTitle('');
        } else {
            setError('Title is required');
        }
    };
    return (
        <div>
            <TextField
                disabled={disabled}
                value={title}
                variant={'outlined'}
                label={'Type value'}
                onChange={onNewTitleChangeHandler}
                onKeyDown={keyDownHandler}
                error={!!error}
                helperText={error}
            />
            <IconButton onClick={addItemHandler} color={'primary'} disabled={disabled} style={{ marginLeft: '15px' }}>
                <ControlPoint />
            </IconButton>
        </div>
    );
});
