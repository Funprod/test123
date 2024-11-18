import './App.css';
import { AppBar, Button, Container, IconButton, LinearProgress, Toolbar } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { TaskType } from '../api/todolists-api';
import { TodolistsList } from '../features/TodolistsLists/TodolistsList';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnakbar';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { RequestStatusType } from './app-reducer';

export type TaskStateType = {
    [key: string]: TaskType[];
};

function App() {
    const status = useSelector<RootState, RequestStatusType>((state) => state.app.status);
    return (
        <div className="App">
            <ErrorSnackbar />
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit">
                        <Menu />
                    </IconButton>
                    <Button color="inherit">Login</Button>
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>
            <Container fixed>
                <TodolistsList />
            </Container>
        </div>
    );
}

export default App;
