import './App.css';
import { AppBar, Button, CircularProgress, Container, IconButton, LinearProgress, Toolbar } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { TaskType } from '../api/todolists-api';
import { TodolistsList } from '../features/TodolistsLists/TodolistsList';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnakbar';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authActions, Login } from '../features/Auth';
import { useCallback, useEffect } from 'react';
import { selectIsInitialized, selectStatus } from './selectors';
import { authSelectors } from '../features/Auth';
import { appActions } from '.';
import { useActions } from './store';

export type TaskStateType = {
    [key: string]: TaskType[];
};

type PropsType = {
    demo?: boolean;
};

function App({ demo = false }: PropsType) {
    const status = useSelector(selectStatus); //useSelector<RootState, RequestStatusType>((state) => state.app.status);
    const initialized = useSelector(selectIsInitialized);
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);
    const { initializedApp } = useActions(appActions);
    const { logout } = useActions(authActions);

    useEffect(() => {
        if (!demo && !isLoggedIn) {
            initializedApp();
        }
    }, []);

    const logOutHandler = useCallback(() => {
        logout();
    }, []);

    if (!initialized) {
        return (
            <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            {!isLoggedIn && <Navigate to={'/login'} />}
            <div className="App">
                <ErrorSnackbar />
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit">
                            <Menu />
                        </IconButton>
                        {isLoggedIn && (
                            <Button color="inherit" onClick={logOutHandler}>
                                Log out
                            </Button>
                        )}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress />}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList demo={demo} />} />
                        <Route path={'/login'} element={<Login />} />
                    </Routes>
                    {/* <TodolistsList demo={demo} /> */}
                </Container>
            </div>
        </>
    );
}

export default App;
