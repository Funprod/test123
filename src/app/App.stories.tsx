import { action } from '@storybook/addon-actions';
import { ReduxStoreProviderDecorator } from '../stories/ReduxStoreProviderDecorator';
import App from './App';

export default {
    title: 'AppWithRedux Component',
    component: App,
    decorators: [ReduxStoreProviderDecorator],
};

const cb = action('Value changed');

export const AppWithReduxBaseExample = (props: any) => {
    return <App demo={true} />;
};
