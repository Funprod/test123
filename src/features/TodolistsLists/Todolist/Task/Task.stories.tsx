import { action } from '@storybook/addon-actions';

import { ReduxStoreProviderDecorator } from '../../../../stories/ReduxStoreProviderDecorator';
import { TaskPriorities, TaskStatuses } from '../../../../api/todolists-api';
import { Task } from './Task';

export default {
    title: 'Task Component',
    component: Task,
    decorators: [ReduxStoreProviderDecorator],
};

// const cb = action("Button 'add' was pressed inside the from");

export const TaskFromBaseExample = () => {
    return (
        <>
            <Task
                task={{
                    id: '1',
                    status: TaskStatuses.Completed,
                    title: 'css',
                    description: '',
                    priority: TaskPriorities.Low,
                    startDate: '',
                    addedDate: '',
                    order: 0,
                    todoListId: 'todolist1',
                    deadline: '',
                }}
                todolistId={'todolist1'}
                key={'1'}
            />
            <Task
                task={{
                    id: '2',
                    status: TaskStatuses.New,
                    title: 'js',
                    description: '',
                    priority: TaskPriorities.Low,
                    startDate: '',
                    addedDate: '',
                    order: 0,
                    todoListId: 'todolist2',
                    deadline: '',
                }}
                todolistId={'todolist2'}
                key={'2'}
            />
        </>
    );
};
