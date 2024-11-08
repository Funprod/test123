import axios from 'axios';
import { useEffect, useState } from 'react';
import { todolistsAPI, UpdateTaskType } from '../api/todolists-api';

export default {
    title: 'API',
};

const token = 'e81fb143-bf82-42c7-98e8-b99ec432e308';
const apiKey = '9fc5eb4c-a7cb-4f8b-ac15-1dc2b2f8171f';

const settings = {
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`,
        'API-KEY': apiKey,
    },
};

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        todolistsAPI.getTodolists().then((res) => {
            setState(res.data);
        });
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};

export const CreateTodolists = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        todolistsAPI.createTodolist('YoYo').then((res) => {
            setState(res.data);
        });
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTodolists = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistId = '07864f37-dec3-4f35-9f22-125e7ed485ab';
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            setState(res.data);
        });
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTodolists = () => {
    const [state, setState] = useState<any>(null);
    useEffect(() => {
        const todolistId = 'dd554e17-f7ac-4466-9ba8-0ae6a8db513d';
        todolistsAPI.updateTodolists(todolistId, 'YoYoHey').then((res) => {
            setState(res.data);
        });
    }, []);

    return <div>{JSON.stringify(state)}</div>;
};

export const GetTasks = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');

    const getTask = () =>
        todolistsAPI.getTasks(todolistId).then((res) => {
            setState(res.data);
        });

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolist id'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value);
                    }}
                />
                <button onClick={getTask}>get tasks</button>
            </div>
        </div>
    );
};

export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');

    const deleteTask = () => {
        todolistsAPI.deleteTasks(todolistId, taskId).then((res) => {
            setState(res.data);
        });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'taskId'}
                    value={taskId}
                    onChange={(e) => {
                        setTaskId(e.currentTarget.value);
                    }}
                />
                <button onClick={deleteTask}>delete task</button>
            </div>
        </div>
    );
};

export const CreateTasks = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');
    const [taskTitle, setTitle] = useState<string>('');

    const createTask = () => {
        todolistsAPI.createTask(todolistId, taskTitle).then((res) => {
            setState(res.data);
        });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'name task'}
                    value={taskTitle}
                    onChange={(e) => {
                        setTitle(e.currentTarget.value);
                    }}
                />
                <button onClick={createTask}>create task</button>
            </div>
        </div>
    );
};

export const UpdateTaskStatus = () => {
    const [state, setState] = useState<any>(null);
    const [taskTitle, setTitle] = useState<string>('');
    const [todolistId, setTodolistId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');
    const [taskDescription, setDescription] = useState<string>('');
    const [taskStatus, setStatus] = useState<number>(0);
    const [taskPriority, setPriority] = useState<number>(0);
    const [taskStartDate, setStartDate] = useState<string>('');
    const [taskDeadline, setDeadline] = useState<string>('');

    const updateStatus = () => {
        const model: UpdateTaskType = {
            description: taskDescription,
            title: taskTitle,
            status: taskStatus,
            priority: taskPriority,
            startDate: '',
            deadline: '',
        };
        todolistsAPI.updateTask(todolistId, taskId, model).then((res) => {
            setState(res.data);
        });
    };

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'taskId'}
                    value={taskId}
                    onChange={(e) => {
                        setTaskId(e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'name task'}
                    value={taskTitle}
                    onChange={(e) => {
                        setTitle(e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'Description'}
                    value={taskDescription}
                    onChange={(e) => {
                        setDescription(e.currentTarget.value);
                    }}
                />
                <input
                    type="number"
                    placeholder={'Status'}
                    value={taskStatus}
                    onChange={(e) => {
                        setStatus(+e.currentTarget.value);
                    }}
                />
                <input
                    type="number"
                    placeholder={'Priority'}
                    value={taskPriority}
                    onChange={(e) => {
                        setPriority(+e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'StartDate'}
                    value={taskStartDate}
                    onChange={(e) => {
                        setStartDate(e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'Deadline'}
                    value={taskDeadline}
                    onChange={(e) => {
                        setDeadline(e.currentTarget.value);
                    }}
                />
                <button onClick={updateStatus}>update task title</button>
            </div>
        </div>
    );
};

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');
    const [taskTitle, setTitle] = useState<string>('');

    const updateTitle = () => {
        // todolistsAPI.updateTaskTitle(todolistId, taskId, taskTitle).then((res) => {
        //     setState(res.data);
        // });
    };
    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'taskId'}
                    value={taskId}
                    onChange={(e) => {
                        setTaskId(e.currentTarget.value);
                    }}
                />
                <input
                    placeholder={'name task'}
                    value={taskTitle}
                    onChange={(e) => {
                        setTitle(e.currentTarget.value);
                    }}
                />
                <button onClick={updateTitle}>update task title</button>
            </div>
        </div>
    );
};
