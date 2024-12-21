import { action } from '@storybook/addon-actions';
import { AddItemForm } from './AddItemForm';
export default {
    title: 'AddItemForm Component',
    component: AddItemForm,
};

const asyncCallback = async (...params: any[]) => {
    action("Button 'add' was pressed inside the from")(...params);
};

export const AddItemFormFromBaseExample = (props: any) => {
    return <AddItemForm addItem={asyncCallback} />;
};

export const AddItemFormFromDisabledExample = (props: any) => {
    return <AddItemForm addItem={asyncCallback} disabled={true} />;
};
