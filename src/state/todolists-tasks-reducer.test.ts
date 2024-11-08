import { TaskStateType } from '../AppWithRedux';
import { tasksReducer } from './tasks-reducer';
import { addTodolistAC, TodolistDomainType, todolistsReducer } from './todolists-reducer';

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: TodolistDomainType[] = [];

    // const action = addTodolistAC('new todolist');
    const action = addTodolistAC({
        id: '',
        addedDate: '',
        order: 0,
        title: 'new todolist',
    });

    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState = todolistsReducer(startTodolistsState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
