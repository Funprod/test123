import * as authSelectors from './selectors';
import { Login } from './Login';
import * as authActions from './auth-actions';
import { slice } from './auth-reducer';

const authReducer = slice.reducer;
export { authSelectors, Login, authActions, authReducer };
