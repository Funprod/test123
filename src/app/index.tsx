import * as appSelectors from './selectors';
import * as appActions from './app-actions';
import { slice } from './app-reducer';

const appReducer = slice.reducer;

export { appSelectors, appActions, appReducer };
