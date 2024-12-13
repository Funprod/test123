import { TaskPriorities, TaskStatuses } from '../../api/todolists-api';
import { TaskStateType } from '../../app/App';
import { addTaskTC, fetchTasksTC, removeTaskTC, tasksReducer, updateTaskTC } from './tasks-reducer';
import { addTodolistTC, fetchTodolistsTC, removeTodolistTC } from './todolists-reducer';
let startState: TaskStateType = {};
beforeEach(() => {
    startState = {
        todolistId1: [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                deadline: '',
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                deadline: '',
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                deadline: '',
            },
        ],
        todolistId2: [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                deadline: '',
            },
            {
                id: '2',
                title: 'milk',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                deadline: '',
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                deadline: '',
            },
        ],
    };
});

test('correct task should be deleted from correct array', () => {
    const endState = tasksReducer(
        startState,
        removeTaskTC.fulfilled({ id: '2', todolistId: 'todolistId2' }, '', { taskId: '2', todolistId: 'todolistId2' }),
    );
    expect(endState).toEqual({
        todolistId1: [
            {
                id: '1',
                title: 'CSS',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                deadline: '',
            },
            {
                id: '2',
                title: 'JS',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                deadline: '',
            },
            {
                id: '3',
                title: 'React',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                deadline: '',
            },
        ],
        todolistId2: [
            {
                id: '1',
                title: 'bread',
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                deadline: '',
            },
            {
                id: '3',
                title: 'tea',
                status: TaskStatuses.Completed,
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                deadline: '',
            },
        ],
    });
});

test('correct task should be added to correct array', () => {
    // const endState = tasksReducer(startState, addTaskAC('juce', 'todolistId2'));
    const endState = tasksReducer(
        startState,
        addTaskTC.fulfilled(
            {
                todoListId: 'todolistId2',
                title: 'juce',
                status: TaskStatuses.New,
                addedDate: '',
                deadline: '',
                description: '',
                order: 0,
                priority: 0,
                startDate: '',
                id: 'id exists',
            },
            '',
            { title: 'juce', todolistId: 'todolistId2' },
        ),
    );

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('juce');
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {
    const endState = tasksReducer(
        startState,
        updateTaskTC.fulfilled({ id: '2', model: { status: TaskStatuses.New }, todolistId: 'todolistId2' }, '', {
            taskId: '2',
            domainModel: { status: TaskStatuses.New },
            todolistId: 'todolistId2',
        }),
    );

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New);
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.New);
});

test('title of specified task should be changed', () => {
    const endState = tasksReducer(
        startState,
        updateTaskTC.fulfilled({ id: '2', model: { title: 'Kefir' }, todolistId: 'todolistId2' }, '', {
            taskId: '2',
            domainModel: { title: 'Kefir' },
            todolistId: 'todolistId2',
        }),
    );

    expect(endState['todolistId2'][1].title).toBe('Kefir');
    expect(endState['todolistId1'][1].title).toBe('JS');
});

test('new array should be added when new todolist is added', () => {
    const endState = tasksReducer(
        startState,
        addTodolistTC.fulfilled(
            {
                todolist: {
                    id: 'bla',
                    addedDate: '',
                    order: 0,
                    title: 'new todolist',
                },
            },
            '',
            { title: 'new todolist' },
        ),
    );

    const keys = Object.keys(endState);
    const newKey = keys.find((k) => k !== 'todolistId1' && k !== 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added');
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
    const action = removeTodolistTC.fulfilled({ id: 'todolistId2' }, '', { todolistId: 'todolistId2' });

    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
    // or
    expect(endState['todolistId2']).toBeUndefined();
});

test('empty arrays should be added when we set todolists', () => {
    const action = fetchTodolistsTC.fulfilled(
        {
            todolists: [
                { id: '1', title: 'title 1', addedDate: '', order: 0 },
                { id: '2', title: 'title 2', addedDate: '', order: 0 },
            ],
        },
        '',
    );

    const endState = tasksReducer({}, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['1']).toStrictEqual([]);
    expect(endState['2']).toStrictEqual([]);
});

test('tasks should be added for todolist', () => {
    const action = fetchTasksTC.fulfilled(
        { tasks: startState['todolistId1'], todolistId: 'todolistId1' },
        '',
        'todolistId1',
    );

    const endState = tasksReducer(
        {
            ['todolistId2']: [],
            ['todolistId1']: [],
        },
        action,
    );

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(0);
});
