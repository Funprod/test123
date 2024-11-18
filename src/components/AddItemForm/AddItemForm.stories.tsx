import { action } from '@storybook/addon-actions';
import { AddItemForm } from './AddItemForm';
export default {
    title: 'AddItemForm Component',
    component: AddItemForm,
};

const cb = action("Button 'add' was pressed inside the from");

export const AddItemFormFromBaseExample = (props: any) => {
    return <AddItemForm addItem={cb} />;
};

export const AddItemFormFromDisabledExample = (props: any) => {
    return <AddItemForm addItem={cb} disabled={true} />;
};
