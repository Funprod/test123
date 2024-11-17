import { action } from '@storybook/addon-actions';
import { ReduxStoreProviderDecorator } from '../stories/ReduxStoreProviderDecorator';
import AppWithRedux from './App';

export default {
    title: 'AppWithRedux Component',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator],
};

const cb = action('Value changed');

export const AppWithReduxBaseExample = (props: any) => {
    return <AppWithRedux />;
};
