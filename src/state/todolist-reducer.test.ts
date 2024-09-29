import {
    addTodolistAC,
    changeTodolistFilterAC,
    ChangeTodolistFilterActionType,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer,
} from './todolists-reducer';
import { v1 } from 'uuid';
import { TodoListType } from '../App';

test('correct todolist should be removed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    // 1. Стартовый state
    const startState: TodoListType[] = [
        { id: todolistId1, title: 'What to learn', filter: 'all' },
        { id: todolistId2, title: 'What to buy', filter: 'all' },
    ];

    // const action = {
    //     type: 'REMOVE-TODOLIST' as const,
    //     payload: {
    //         id: todolistId1,
    //     },
    // };
    // const endState = todolistsReducer(startState, action);

    const endState = todolistsReducer(
        startState,
        removeTodolistAC(todolistId1),
    );

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TodoListType[] = [
        { id: todolistId1, title: 'What to learn', filter: 'all' },
        { id: todolistId2, title: 'What to buy', filter: 'all' },
    ];

    // const action = {
    //     type: 'ADD-TODOLIST' as const,
    //     payload: {
    //         title: 'New Todolist',
    //     },
    // };
    const endState = todolistsReducer(
        startState,
        addTodolistAC('New Todolist'),
    );

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe('New Todolist');
    expect(endState[2].filter).toBe('all');
});

test('correct todolist should change its name', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TodoListType[] = [
        { id: todolistId1, title: 'What to learn', filter: 'all' },
        { id: todolistId2, title: 'What to buy', filter: 'all' },
    ];

    // const action = {
    //     type: 'CHANGE-TODOLIST-TITLE' as const,
    //     payload: {
    //         id: todolistId2,
    //         title: 'New Todolist',
    //     },
    // };

    const endState = todolistsReducer(
        startState,
        changeTodolistTitleAC(todolistId2, 'New Todolist'),
    );

    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe('New Todolist');
});

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: TodoListType[] = [
        { id: todolistId1, title: 'What to learn', filter: 'all' },
        { id: todolistId2, title: 'What to buy', filter: 'all' },
    ];

    // const action: ChangeTodolistFilterActionType = {
    //     type: 'CHANGE-TODOLIST-FILTER',
    //     payload: {
    //         id: todolistId2,
    //         filter: 'completed',
    //     },
    // };

    const endState = todolistsReducer(
        startState,
        changeTodolistFilterAC(todolistId2, 'completed'),
    );

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe('completed');
});
