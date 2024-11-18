import React, { ChangeEvent, useState } from 'react';
import { TextField } from '@mui/material';

type EditableSpanType = {
    title: string;
    onChange: (newTitle: string) => void;
    disabled?: boolean;
};

export const EditableSpan = React.memo(({ disabled, ...props }: EditableSpanType) => {
    console.log('Edit is call');

    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');

    const activateEditMode = () => {
        setEditMode(!editMode);
        setTitle(props.title);
    };

    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    };

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
            activateEditMode();
            props.onChange(title);
        }
    };
    return editMode ? (
        <TextField
            disabled={disabled}
            onBlur={activateViewMode}
            value={title}
            autoFocus
            onChange={onChangeTitle}
            onKeyDown={onKeyDownHandler}
        />
    ) : (
        <span onDoubleClick={activateEditMode}>{props.title}</span>
    );
});
