import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { setAppErrorAC } from '../../app/app-reducer';

export function ErrorSnackbar() {
    //const [open, setOpen] = React.useState(true);
    const error = useSelector<RootState, string | null>((state) => state.app.error);
    const dispatch = useDispatch();

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppErrorAC({ error: null }));
        //setOpen(false);
    };

    const isOpen = error !== null;

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>
    );
}
