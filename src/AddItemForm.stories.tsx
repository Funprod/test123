import { AddItemForm } from './AddItemForm';
import { action } from '@storybook/addon-actions';
export default {
    title: 'AddItemForm Component',
    component: AddItemForm,
};

const cb = action("Button 'add' was pressed inside the from");

export const AddItemFormFromBaseExample = (props: any) => {
    return <AddItemForm addItem={cb} />;
};
