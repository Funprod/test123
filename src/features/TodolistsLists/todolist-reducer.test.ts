import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistAC,
    TodolistDomainType,
    todolistsReducer,
} from './todolists-reducer';
import { v1 } from 'uuid';

let todolistId1 = '';
let todolistId2 = '';
let startState: TodolistDomainType[] = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        { id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle' },
        { id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0, entityStatus: 'idle' },
    ];
});

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    const endState = todolistsReducer(
        startState,
        addTodolistAC({
            id: '',
            addedDate: '',
            order: 0,
            title: 'new todolist',
        }),
    );

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('new todolist');
    expect(endState[0].filter).toBe('all');
});

test('correct todolist should change its name', () => {
    const endState = todolistsReducer(startState, changeTodolistTitleAC(todolistId2, 'New Todolist'));

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe('New Todolist');
});

test('correct filter of todolist should be changed', () => {
    const endState = todolistsReducer(startState, changeTodolistFilterAC(todolistId2, 'completed'));

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe('completed');
});
test('todolist should be set to the state', () => {
    const action = setTodolistAC(startState);

    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2);
});
