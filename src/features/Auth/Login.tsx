import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsLoggedIn } from './selectors';
import { authActions } from '.';
import { useActions } from '../../utils/redux-utils';

type FormValuesType = {
    email: string;
    password: string;
    rememberMe: boolean;
};
export const Login = () => {
    const { login } = useActions(authActions);

    const isLoggedIn = useSelector(selectIsLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            if (!values.email) {
                return {
                    email: 'Email is required',
                };
            }
            if (!values.password) {
                return {
                    password: 'Password is required',
                };
            }
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
            const resultAction = await login(values);
            if (login.rejected.match(resultAction)) {
                if (resultAction.payload?.fieldsErrors?.length) {
                    const error = resultAction.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field, error.error);
                }
            }
        },
    });

    if (isLoggedIn) {
        return <Navigate to={'/'} />;
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'} xs={4}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To login get registered
                                <a
                                    style={{ marginLeft: '5px' }}
                                    href={'https://social-network.samuraijs.com/'}
                                    target={'_blank'}
                                    rel="noreferrer"
                                >
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p>
                                <b>Email:</b> free@samuraijs.com
                            </p>
                            <p>
                                <b>Password:</b> free
                            </p>
                        </FormLabel>
                        <FormGroup>
                            <TextField label="Email" margin="normal" {...formik.getFieldProps('email')} />
                            {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                            <TextField
                                type="password"
                                label="Password"
                                margin="normal"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                            <FormControlLabel
                                label={'Remember me'}
                                control={
                                    <Checkbox
                                        {...formik.getFieldProps('rememberMe')}
                                        checked={formik.values.rememberMe}
                                    />
                                }
                            />
                            <Button type={'submit'} variant={'contained'} color={'primary'}>
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    );
};
