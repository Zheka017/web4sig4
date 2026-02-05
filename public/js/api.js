// API Client
const API_URL = 'http://localhost:3000';

class TaskAPI {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Auth Methods
    async register(email, password, name) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.errors?.[0] || 'Ошибка регистрации');
            }

            this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка входа');
            }

            this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async getCurrentUser() {
        try {
            const response = await fetch(`${API_URL}/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка получения пользователя');
            }

            return data.user;
        } catch (error) {
            throw error;
        }
    }

    // Task Methods
    async createTask(title, description) {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.errors?.[0] || 'Ошибка создания задачи');
            }

            return data.task;
        } catch (error) {
            throw error;
        }
    }

    async getTasks() {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка получения задач');
            }

            return data.tasks || [];
        } catch (error) {
            throw error;
        }
    }

    async getTask(id) {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ошибка получения задачи');
            }

            return data.task;
        } catch (error) {
            throw error;
        }
    }

    async updateTask(id, status) {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.errors?.[0] || 'Ошибка обновления задачи');
            }

            return data.task;
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(id) {
        try {
            const response = await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Ошибка удаления задачи');
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    isAuthenticated() {
        return !!this.token;
    }
}

const api = new TaskAPI();
