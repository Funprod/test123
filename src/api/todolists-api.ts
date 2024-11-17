import axios from 'axios';

const token = 'e81fb143-bf82-42c7-98e8-b99ec432e308';
const apiKey = '9fc5eb4c-a7cb-4f8b-ac15-1dc2b2f8171f';

const settings = {
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`,
        'API-KEY': apiKey,
    },
};

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings,
});
// Api
export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', { title });
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`);
    },
    updateTodolists(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title });
    },
    getTasks(todolistId: string) {
        return instance.get<GetTaskResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTasks(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, { title });
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
        return instance.put<ResponseType<TaskType>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
};

// Types
export type TodolistType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
};
type ResponseType<D = {}> = {
    resultCode: number;
    messages: string[];
    data: D;
};
export enum TaskStatuses {
    New = 0,
    inProgress = 1,
    Completed = 2,
    Draft = 3,
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4,
}
export type TaskType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
};
export type UpdateTaskType = {
    description: string;
    title: string;
    status: number;
    priority: number;
    startDate: string;
    deadline: string;
};
type GetTaskResponse = {
    error: string | null;
    totalCount: number;
    items: TaskType[];
};
