import './App.css';
import { AppBar, Button, CircularProgress, Container, IconButton, LinearProgress, Toolbar } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { TaskType } from '../api/todolists-api';
import { TodolistsList } from '../features/TodolistsLists/TodolistsList';
import { ErrorSnackbar } from '../components/ErrorSnackbar/ErrorSnakbar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { initializedAppTC, RequestStatusType } from './app-reducer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../features/Login/Login';
import { useCallback, useEffect } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { logoutTC } from '../features/Login/auth-reducer';

export type TaskStateType = {
    [key: string]: TaskType[];
};

type PropsType = {
    demo?: boolean;
};

function App({ demo = false }: PropsType) {
    const status = useSelector<RootState, RequestStatusType>((state) => state.app.status);
    const initialized = useSelector<RootState, boolean>((state) => state.app.initialized);
    const isLoggedIn = useSelector<RootState, boolean>((state) => state.auth.isLoggedIn);
    const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();

    useEffect(() => {
        if (!demo) {
            dispatch(initializedAppTC());
        }
    }, []);

    const logOutHandler = useCallback(() => {
        dispatch(logoutTC());
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
