import { ChangeEvent } from 'react';
import { FilterValuesType } from './App';
import { AddItemForm } from './AddItemForm';
import { EditableSpan } from './EditableSpan';
import { Button, Checkbox, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

type PropsType = {
    id: string;
    title: string;
    tasks: Array<TaskType>;
    removeTask: (id: string, todoListId: string) => void;
    changeFilter: (value: FilterValuesType, todoListId: string) => void;
    addTask: (title: string, todoListId: string) => void;
    changeStatus: (taskId: string, isDone: boolean, todoListId: string) => void;
    changeTaskTitle: (
        taskId: string,
        newTitle: string,
        todoListId: string,
    ) => void;
    removeTodoList: (todoListId: string) => void;
    changeTodoListTitle: (todoListId: string, newTitle: string) => void;
    filter: FilterValuesType;
};

export function TodoList(props: PropsType) {
    const onAllClickHandler = () => props.changeFilter('all', props.id);
    const onActiveClickHandler = () => props.changeFilter('active', props.id);
    const onCompletedClickHandler = () =>
        props.changeFilter('completed', props.id);

    const removeTodoList = () => {
        props.removeTodoList(props.id);
    };
    const changeTodoListTitle = (newTitle: string) => {
        props.changeTodoListTitle(props.id, newTitle);
    };

    const addTask = (title: string) => {
        props.addTask(title, props.id);
    };
    return (
        <div>
            <h3>
                <EditableSpan
                    title={props.title}
                    onChange={changeTodoListTitle}
                />
                <IconButton onClick={removeTodoList}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} />
            <ul>
                {props.tasks.map((t) => {
                    const onRemoveHandler = () =>
                        props.removeTask(t.id, props.id);
                    const onChangeStatusHandler = (
                        e: ChangeEvent<HTMLInputElement>,
                    ) => {
                        props.changeStatus(
                            t.id,
                            e.currentTarget.checked,
                            props.id,
                        );
                    };
                    const onChangeTitleHandler = (newTitle: string) => {
                        props.changeTaskTitle(t.id, newTitle, props.id);
                    };
                    return (
                        <li key={t.id} className={t.isDone ? 'is-done' : ''}>
                            <Checkbox
                                checked={t.isDone}
                                onChange={onChangeStatusHandler}
                            />
                            <EditableSpan
                                title={t.title}
                                onChange={onChangeTitleHandler}
                            />
                            <IconButton onClick={onRemoveHandler}>
                                <Delete />
                            </IconButton>
                        </li>
                    );
                })}
            </ul>
            <div>
                <Button
                    variant={props.filter === 'all' ? 'contained' : 'text'}
                    onClick={onAllClickHandler}
                >
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
                    variant={
                        props.filter === 'completed' ? 'contained' : 'text'
                    }
                    onClick={onCompletedClickHandler}
                >
                    Completed
                </Button>
            </div>
        </div>
    );
}
