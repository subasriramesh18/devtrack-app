const { v4: uuidv4 } = require('uuid');

/**
 * Seed data matching the DevTrack ecosystem
 */
const initialUsers = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@devtrack.io',
    handle: 'arivera',
    role: 'Principal Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    company: 'DevTrack Labs',
    location: 'San Francisco, CA',
    bio: 'Distributed systems architect & TypeScript enthusiast.',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-02-15T10:30:00.000Z',
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@devtrack.io',
    handle: 'schen',
    role: 'Staff Frontend Engineer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    company: 'DevTrack Labs',
    location: 'Seattle, WA',
    bio: 'Design systems, Next.js, and CSS performance specialist.',
    createdAt: '2025-01-12T09:15:00.000Z',
    updatedAt: '2025-02-18T14:20:00.000Z',
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@devtrack.io',
    handle: 'erostova',
    role: 'Lead DevOps & Cloud Engineer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    company: 'DevTrack Labs',
    location: 'Austin, TX',
    bio: 'Kubernetes, Terraform, and high availability systems.',
    createdAt: '2025-01-15T11:00:00.000Z',
    updatedAt: '2025-02-20T16:45:00.000Z',
  },
  {
    id: 'usr-4',
    name: 'Marcus Brody',
    email: 'marcus.brody@devtrack.io',
    handle: 'mbrody',
    role: 'Senior Backend Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    company: 'DevTrack Labs',
    location: 'Boston, MA',
    bio: 'Node.js, GraphQL, Redis & database optimization.',
    createdAt: '2025-01-18T14:30:00.000Z',
    updatedAt: '2025-02-22T09:10:00.000Z',
  },
];

const initialProjects = [
  {
    id: 'proj-1',
    name: 'Core Engine API',
    description: 'High-throughput microservice backend handling real-time developer telemetry and Git sync.',
    category: 'Backend',
    color: '#6366f1',
    status: 'on_track',
    progress: 74,
    totalTasks: 18,
    completedTasks: 13,
    leadId: 'usr-1',
    repoUrl: 'https://github.com/devtrack/core-engine-api',
    techStack: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Docker'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-02-28T12:00:00.000Z',
  },
  {
    id: 'proj-2',
    name: 'DevTrack UI System',
    description: 'Modern component library and design system for all internal engineering dashboards.',
    category: 'Frontend',
    color: '#06b6d4',
    status: 'on_track',
    progress: 88,
    totalTasks: 25,
    completedTasks: 22,
    leadId: 'usr-2',
    repoUrl: 'https://github.com/devtrack/ui-system',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Storybook'],
    createdAt: '2025-01-05T00:00:00.000Z',
    updatedAt: '2025-02-27T15:30:00.000Z',
  },
  {
    id: 'proj-3',
    name: 'Telemetry & Git Ingestion',
    description: 'Event-driven streaming worker for processing webhook payloads from GitHub and GitLab.',
    category: 'DevOps',
    color: '#10b981',
    status: 'at_risk',
    progress: 45,
    totalTasks: 14,
    completedTasks: 6,
    leadId: 'usr-3',
    repoUrl: 'https://github.com/devtrack/telemetry-pipeline',
    techStack: ['Go', 'Kafka', 'Kubernetes', 'Prometheus', 'Grafana'],
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-02-25T18:00:00.000Z',
  },
];

const initialTasks = [
  {
    id: 'tsk-1',
    title: 'Implement OAuth 2.0 and JWT token rotation',
    description: 'Set up stateless auth tokens with refresh cycle and redis-backed revocation blocklist.',
    status: 'in-progress',
    priority: 'urgent',
    projectId: 'proj-1',
    assigneeId: 'usr-1',
    dueDate: '2025-03-05',
    tags: ['Auth', 'Security', 'Backend'],
    estimatedHours: 12,
    loggedHours: 8,
    branchName: 'feature/jwt-rotation',
    commitSha: 'a8f3b2c',
    createdAt: '2025-02-20T09:00:00.000Z',
    updatedAt: '2025-02-27T11:30:00.000Z',
  },
  {
    id: 'tsk-2',
    title: 'Build Dark Mode glassmorphic tokens in Tailwind',
    description: 'Refactor color tokens to support dynamic HSL tint shifting and backdrop blur.',
    status: 'done',
    priority: 'high',
    projectId: 'proj-2',
    assigneeId: 'usr-2',
    dueDate: '2025-02-28',
    tags: ['UI', 'CSS', 'Design'],
    estimatedHours: 6,
    loggedHours: 6,
    branchName: 'style/glass-tokens',
    commitSha: '9e41fc7',
    createdAt: '2025-02-21T10:15:00.000Z',
    updatedAt: '2025-02-28T16:00:00.000Z',
  },
  {
    id: 'tsk-3',
    title: 'Set up Prometheus scraping for GitHub Webhook latency',
    description: 'Create metrics middleware recording p95 and p99 ingress response times.',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj-3',
    assigneeId: 'usr-3',
    dueDate: '2025-03-10',
    tags: ['Metrics', 'DevOps', 'Observability'],
    estimatedHours: 8,
    loggedHours: 0,
    branchName: 'infra/prometheus-metrics',
    createdAt: '2025-02-24T14:00:00.000Z',
    updatedAt: '2025-02-24T14:00:00.000Z',
  },
  {
    id: 'tsk-4',
    title: 'Optimize Redis caching layer for user workspace feeds',
    description: 'Implement cache warming and TTL eviction strategies to achieve sub-10ms response times.',
    status: 'in-progress',
    priority: 'high',
    projectId: 'proj-1',
    assigneeId: 'usr-4',
    dueDate: '2025-03-08',
    tags: ['Performance', 'Redis', 'Backend'],
    estimatedHours: 10,
    loggedHours: 4,
    branchName: 'perf/redis-caching',
    createdAt: '2025-02-25T11:00:00.000Z',
    updatedAt: '2025-02-28T09:45:00.000Z',
  },
  {
    id: 'tsk-5',
    title: 'Create KanBan board drag and drop interaction',
    description: 'Integrate accessible keyboard and pointer drag mechanics across sprint status columns.',
    status: 'todo',
    priority: 'medium',
    projectId: 'proj-2',
    assigneeId: 'usr-2',
    dueDate: '2025-03-12',
    tags: ['Frontend', 'Kanban', 'UX'],
    estimatedHours: 16,
    loggedHours: 0,
    branchName: 'feature/kanban-dnd',
    createdAt: '2025-02-26T13:30:00.000Z',
    updatedAt: '2025-02-26T13:30:00.000Z',
  },
];

class DataStore {
  constructor() {
    this.users = [];
    this.projects = [];
    this.tasks = [];
    this.reset();
  }

  /**
   * Reset store to initial seed data (useful for test runs and dev reloads)
   */
  reset() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.projects = JSON.parse(JSON.stringify(initialProjects));
    this.tasks = JSON.parse(JSON.stringify(initialTasks));
  }

  // ==========================================
  // USER METHODS
  // ==========================================

  async getUsers(filters = {}) {
    let result = [...this.users];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.handle && u.handle.toLowerCase().includes(q)) ||
          (u.role && u.role.toLowerCase().includes(q))
      );
    }

    if (filters.role) {
      result = result.filter((u) => u.role.toLowerCase() === filters.role.toLowerCase());
    }

    return result;
  }

  async getUserById(id) {
    return this.users.find((u) => u.id === id) || null;
  }

  async getUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async createUser(userData) {
    const newUser = {
      id: userData.id || `usr-${uuidv4().substring(0, 8)}`,
      name: userData.name,
      email: userData.email,
      handle: userData.handle || userData.name.toLowerCase().replace(/\s+/g, ''),
      role: userData.role || 'Software Engineer',
      avatar:
        userData.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      company: userData.company || 'DevTrack Labs',
      location: userData.location || 'Remote',
      bio: userData.bio || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id, updateData) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const existingUser = this.users[index];
    const updatedUser = {
      ...existingUser,
      ...updateData,
      id: existingUser.id, // Immutable ID
      createdAt: existingUser.createdAt, // Immutable creation time
      updatedAt: new Date().toISOString(),
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    // Remove user
    this.users.splice(index, 1);

    // Unassign tasks assigned to this user
    this.tasks = this.tasks.map((t) => (t.assigneeId === id ? { ...t, assigneeId: null } : t));

    // Clear leadId from projects if this user was the lead
    this.projects = this.projects.map((p) => (p.leadId === id ? { ...p, leadId: null } : p));

    return true;
  }

  // ==========================================
  // PROJECT METHODS
  // ==========================================

  async getProjects(filters = {}) {
    let result = [...this.projects];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (filters.category) {
      result = result.filter((p) => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.status) {
      result = result.filter((p) => p.status.toLowerCase() === filters.status.toLowerCase());
    }

    // Hydrate project with lead object & live task counts
    return Promise.all(result.map((p) => this.hydrateProject(p)));
  }

  async getProjectById(id) {
    const project = this.projects.find((p) => p.id === id);
    if (!project) return null;
    return this.hydrateProject(project);
  }

  async hydrateProject(project) {
    const lead = project.leadId ? await this.getUserById(project.leadId) : null;
    const projectTasks = this.tasks.filter((t) => t.projectId === project.id);
    const completedTasks = projectTasks.filter(
      (t) => t.status === 'done' || t.status === 'completed'
    ).length;
    const totalTasks = projectTasks.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (project.progress || 0);

    return {
      ...project,
      progress,
      totalTasks: totalTasks > 0 ? totalTasks : project.totalTasks,
      completedTasks: totalTasks > 0 ? completedTasks : project.completedTasks,
      lead,
    };
  }

  async createProject(projectData) {
    const newProject = {
      id: projectData.id || `proj-${uuidv4().substring(0, 8)}`,
      name: projectData.name,
      description: projectData.description || '',
      category: projectData.category || 'Backend',
      color: projectData.color || '#6366f1',
      status: projectData.status || 'on_track',
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      leadId: projectData.leadId || null,
      repoUrl: projectData.repoUrl || '',
      techStack: projectData.techStack || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.push(newProject);
    return this.hydrateProject(newProject);
  }

  async updateProject(id, updateData) {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existingProject = this.projects[index];
    const updatedProject = {
      ...existingProject,
      ...updateData,
      id: existingProject.id,
      createdAt: existingProject.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.projects[index] = updatedProject;
    return this.hydrateProject(updatedProject);
  }

  async deleteProject(id) {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.projects.splice(index, 1);
    // Cascade delete tasks belonging to this project
    this.tasks = this.tasks.filter((t) => t.projectId !== id);

    return true;
  }

  // ==========================================
  // TASK METHODS
  // ==========================================

  // Standardizes status formats (e.g. in_progress -> in-progress)
  normalizeStatus(status) {
    if (!status) return 'todo';
    const s = status.toLowerCase().replace('_', '-');
    if (s === 'todo' || s === 'in-progress' || s === 'done') {
      return s;
    }
    return status;
  }

  async getTasks(filters = {}) {
    let result = [...this.tasks];

    if (filters.projectId) {
      result = result.filter((t) => t.projectId === filters.projectId);
    }

    if (filters.assigneeId) {
      result = result.filter((t) => t.assigneeId === filters.assigneeId);
    }

    if (filters.status) {
      const normalizedQueryStatus = this.normalizeStatus(filters.status);
      result = result.filter((t) => this.normalizeStatus(t.status) === normalizedQueryStatus);
    }

    if (filters.priority) {
      result = result.filter((t) => t.priority.toLowerCase() === filters.priority.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }

    return Promise.all(result.map((t) => this.hydrateTask(t)));
  }

  async getTaskById(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    return this.hydrateTask(task);
  }

  async getTasksByProjectId(projectId) {
    return this.getTasks({ projectId });
  }

  async hydrateTask(task) {
    const assignee = task.assigneeId ? await this.getUserById(task.assigneeId) : null;
    const project = task.projectId ? this.projects.find((p) => p.id === task.projectId) : null;

    return {
      ...task,
      status: this.normalizeStatus(task.status),
      assignee,
      project: project
        ? {
            id: project.id,
            name: project.name,
            color: project.color,
            category: project.category,
          }
        : null,
    };
  }

  async createTask(taskData) {
    const normalizedStatus = this.normalizeStatus(taskData.status || 'todo');

    const newTask = {
      id: taskData.id || `tsk-${uuidv4().substring(0, 8)}`,
      title: taskData.title,
      description: taskData.description || '',
      status: normalizedStatus,
      priority: taskData.priority || 'medium',
      projectId: taskData.projectId,
      assigneeId: taskData.assigneeId || null,
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      tags: taskData.tags || [],
      estimatedHours: taskData.estimatedHours !== undefined ? Number(taskData.estimatedHours) : 0,
      loggedHours: taskData.loggedHours !== undefined ? Number(taskData.loggedHours) : 0,
      branchName: taskData.branchName || '',
      commitSha: taskData.commitSha || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.push(newTask);
    return this.hydrateTask(newTask);
  }

  async updateTask(id, updateData) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existingTask = this.tasks[index];
    const dataToUpdate = { ...updateData };

    if (dataToUpdate.status) {
      dataToUpdate.status = this.normalizeStatus(dataToUpdate.status);
    }

    const updatedTask = {
      ...existingTask,
      ...dataToUpdate,
      id: existingTask.id,
      createdAt: existingTask.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.tasks[index] = updatedTask;
    return this.hydrateTask(updatedTask);
  }

  async updateTaskStatus(id, status) {
    return this.updateTask(id, { status: this.normalizeStatus(status) });
  }

  async deleteTask(id) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }
}

// Export singleton instance
const dataStore = new DataStore();

module.exports = dataStore;
