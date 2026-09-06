import { Project, Task, User, ApiResponse, AuthResponseData, AiSuggestedTask } from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const TOKEN_KEY = 'devtrack_jwt_token';

/**
 * Token management helpers
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Generic API request wrapper
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        data.message ||
        (data.errors && data.errors[0]?.message) ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).data = data;
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

/**
 * API Client Services
 */
export const api = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  auth: {
    async register(userData: {
      name: string;
      email: string;
      password?: string;
      role?: string;
      handle?: string;
      avatar?: string;
      company?: string;
      location?: string;
      bio?: string;
    }): Promise<ApiResponse<AuthResponseData>> {
      const res = await fetchApi<AuthResponseData>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (res.data?.token) {
        setToken(res.data.token);
      }
      return res;
    },

    async login(credentials: {
      email: string;
      password?: string;
    }): Promise<ApiResponse<AuthResponseData>> {
      const res = await fetchApi<AuthResponseData>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (res.data?.token) {
        setToken(res.data.token);
      }
      return res;
    },

    async getMe(): Promise<ApiResponse<User>> {
      return fetchApi<User>('/auth/me');
    },

    async logout(): Promise<ApiResponse<null>> {
      try {
        await fetchApi<null>('/auth/logout', { method: 'POST' });
      } catch (err) {
        console.warn('Backend logout failed, continuing local clear', err);
      } finally {
        removeToken();
      }
      return { success: true, data: null };
    },
  },

  // ==========================================
  // PROJECTS
  // ==========================================
  projects: {
    async getAll(params?: {
      category?: string;
      status?: string;
      search?: string;
    }): Promise<ApiResponse<Project[]>> {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.status && params.status !== 'All') query.set('status', params.status);
      if (params?.search) query.set('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return fetchApi<Project[]>(`/projects${qs}`);
    },

    async getById(id: string): Promise<ApiResponse<Project>> {
      return fetchApi<Project>(`/projects/${id}`);
    },

    async getTasks(id: string): Promise<ApiResponse<Task[]>> {
      return fetchApi<Task[]>(`/projects/${id}/tasks`);
    },

    async create(projectData: Partial<Project>): Promise<ApiResponse<Project>> {
      return fetchApi<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
    },

    async update(id: string, projectData: Partial<Project>): Promise<ApiResponse<Project>> {
      return fetchApi<Project>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
      });
    },

    async delete(id: string): Promise<ApiResponse<{ id: string }>> {
      return fetchApi<{ id: string }>(`/projects/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // ==========================================
  // TASKS
  // ==========================================
  tasks: {
    async getAll(params?: {
      projectId?: string;
      assigneeId?: string;
      status?: string;
      priority?: string;
      search?: string;
    }): Promise<ApiResponse<Task[]>> {
      const query = new URLSearchParams();
      if (params?.projectId && params.projectId !== 'all') query.set('projectId', params.projectId);
      if (params?.assigneeId && params.assigneeId !== 'all') query.set('assigneeId', params.assigneeId);
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.priority && params.priority !== 'all') query.set('priority', params.priority);
      if (params?.search) query.set('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return fetchApi<Task[]>(`/tasks${qs}`);
    },

    async getById(id: string): Promise<ApiResponse<Task>> {
      return fetchApi<Task>(`/tasks/${id}`);
    },

    async create(taskData: Partial<Task>): Promise<ApiResponse<Task>> {
      return fetchApi<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
    },

    async update(id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
      return fetchApi<Task>(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });
    },

    async updateStatus(id: string, status: string): Promise<ApiResponse<Task>> {
      return fetchApi<Task>(`/tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    async delete(id: string): Promise<ApiResponse<{ id: string }>> {
      return fetchApi<{ id: string }>(`/tasks/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // ==========================================
  // AI ASSISTANT
  // ==========================================
  ai: {
    async generateTasks(
      goal: string,
      projectName?: string
    ): Promise<ApiResponse<AiSuggestedTask[]>> {
      return fetchApi<AiSuggestedTask[]>('/ai/generate-tasks', {
        method: 'POST',
        body: JSON.stringify({ goal, projectName }),
      });
    },
  },

  // ==========================================
  // USERS
  // ==========================================
  users: {
    async getAll(params?: { search?: string; role?: string }): Promise<ApiResponse<User[]>> {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.role) query.set('role', params.role);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return fetchApi<User[]>(`/users${qs}`);
    },

    async getById(id: string): Promise<ApiResponse<User>> {
      return fetchApi<User>(`/users/${id}`);
    },

    async create(userData: Partial<User>): Promise<ApiResponse<User>> {
      return fetchApi<User>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    async update(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
      return fetchApi<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },

    async delete(id: string): Promise<ApiResponse<{ id: string }>> {
      return fetchApi<{ id: string }>(`/users/${id}`, {
        method: 'DELETE',
      });
    },
  },
};
