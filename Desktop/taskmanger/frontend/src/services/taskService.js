import api from './api';

export const createTask = (taskData) => api.post('/tasks', taskData);
export const getTasks = (sort) => api.get(`/tasks?sort=${sort}`);
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
