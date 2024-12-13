import { action } from '@storybook/addon-actions';
import { BrowserRouterDecorator, ReduxStoreProviderDecorator } from '../stories/ReduxStoreProviderDecorator';
import App from './App';

export default {
    title: 'App Stories',
    component: App,
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator],
};

export const AppBaseExample = (props: any) => {
    return <App demo={true} />;
};
