import React, { useState } from 'react';
import './App.css';
import { TaskType, TodoList } from './TodoList';
import { v1 } from 'uuid';
import { AddItemForm } from './AddItemForm';
import {
    AppBar,
    Button,
    Container,
    Grid,
    IconButton,
    Paper,
    Toolbar,
} from '@mui/material';
import { Menu } from '@mui/icons-material';

export type FilterValuesType = 'all' | 'completed' | 'active';

export type TodoListType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};

export type TaskStateType = {
    [key: string]: TaskType[];
};

function App() {
    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        { id: todoListId1, title: 'What to Learn', filter: 'all' },
        { id: todoListId2, title: 'What to bye', filter: 'all' },
    ]);

    let [tasksObj, setTasks] = useState<TaskStateType>({
        [todoListId1]: [
            { id: v1(), title: 'CSS', isDone: true },
            { id: v1(), title: 'JS', isDone: true },
            { id: v1(), title: 'React', isDone: false },
            { id: v1(), title: 'Redux', isDone: false },
        ],
        [todoListId2]: [
            { id: v1(), title: 'Book', isDone: true },
            { id: v1(), title: 'Milk', isDone: true },
            { id: v1(), title: 'Coffee', isDone: false },
            { id: v1(), title: 'Tea', isDone: false },
        ],
    });

    function removeTask(id: string, todoListId: string) {
        let tasks = tasksObj[todoListId];
        let filteredTasks = tasks.filter((t) => t.id !== id);
        tasksObj[todoListId] = filteredTasks;
        setTasks({ ...tasksObj });
    }

    function addTask(title: string, todoListId: string) {
        let newTask = { id: v1(), title: title, isDone: false };
        let tasks = tasksObj[todoListId];
        let newTasks = [newTask, ...tasks];
        tasksObj[todoListId] = newTasks;
        setTasks({ ...tasksObj });
    }

    function changeStatus(taskId: string, isDone: boolean, todoListId: string) {
        let tasks = tasksObj[todoListId];
        let task = tasks.find((t) => t.id === taskId);
        if (task) {
            task.isDone = isDone;
            setTasks({ ...tasksObj });
        }
    }

    function changeTaskTitle(
        taskId: string,
        newTitle: string,
        todoListId: string,
    ) {
        let tasks = tasksObj[todoListId];
        let task = tasks.find((t) => t.id === taskId);
        if (task) {
            task.title = newTitle;
            setTasks({ ...tasksObj });
        }
    }

    function changeFilter(value: FilterValuesType, todoListId: string) {
        let todoList = todoLists.find((tl) => tl.id === todoListId);
        if (todoList) {
            todoList.filter = value;
            setTodoLists([...todoLists]);
        }
    }

    let removeTodoList = (todoListId: string) => {
        let filteredTodoList = todoLists.filter((t) => t.id !== todoListId);
        setTodoLists(filteredTodoList);
        delete tasksObj[todoListId];
        setTasks({ ...tasksObj });
    };
    let changeTodoListTitle = (todoListId: string, newTitle: string) => {
        let todoList = todoLists.find((tl) => tl.id === todoListId);
        if (todoList) {
            todoList.title = newTitle;
            setTodoLists([...todoLists]);
        }
    };

    const addTodolist = (title: string) => {
        let todolsits: TodoListType = {
            id: v1(),
            title: title,
            filter: 'all',
        };
        setTodoLists([todolsits, ...todoLists]);
        setTasks({
            ...tasksObj,
            [todolsits.id]: [],
        });
    };

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit">
                        <Menu />
                    </IconButton>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{ padding: '20px' }}>
                    <AddItemForm addItem={addTodolist} />
                </Grid>
                <Grid container spacing={3}>
                    {todoLists.map((tl) => {
                        let tasksForTodoList = tasksObj[tl.id];

                        if (tl.filter === 'completed') {
                            tasksForTodoList = tasksForTodoList.filter(
                                (t) => t.isDone === true,
                            );
                        }
                        if (tl.filter === 'active') {
                            tasksForTodoList = tasksForTodoList.filter(
                                (t) => t.isDone === false,
                            );
                        }

                        return (
                            <Grid item>
                                <Paper style={{ padding: '20px' }}>
                                    <TodoList
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodoList}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeStatus={changeStatus}
                                        changeTaskTitle={changeTaskTitle}
                                        filter={tl.filter}
                                        removeTodoList={removeTodoList}
                                        changeTodoListTitle={
                                            changeTodoListTitle
                                        }
                                    />
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
