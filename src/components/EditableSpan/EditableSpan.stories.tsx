import { action } from '@storybook/addon-actions';
import { EditableSpan } from './EditableSpan';

export default {
    title: 'EditableSpan Component',
    component: EditableSpan,
};

const cb = action('Value changed');

export const EditableSpanBaseExample = (props: any) => {
    return <EditableSpan onChange={cb} title={'Start value'} />;
};
