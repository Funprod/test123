import * as appSelectors from '../../app/selectors';
import * as appAsyncActions from '../../app/app-actions';
import { slice } from './app-reducer';

const appReducer = slice.reducer;
const appActions = slice.actions;

export { appSelectors, appAsyncActions, appReducer, appActions };
