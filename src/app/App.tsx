import './App.css';
import { AppBar, Button, Container, IconButton, Toolbar } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { TaskType } from '../api/todolists-api';
import { TodolistsList } from '../features/TodolistsLists/TodolistsList';

export type TaskStateType = {
    [key: string]: TaskType[];
};

function AppWithRedux() {
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
                <TodolistsList />
            </Container>
        </div>
    );
}

export default AppWithRedux;
