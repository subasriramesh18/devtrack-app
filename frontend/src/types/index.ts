export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'in-progress' | 'in_review' | 'done';

export interface Assignee {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  avatar: string;
  role: string;
  handle?: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  handle?: string;
  role?: string;
  avatar?: string;
  company?: string;
  location?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  id: string;
  _id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  project?: string | Project | { id: string; _id?: string; name: string; color?: string };
  projectName?: string;
  projectColor?: string;
  assignee?: Assignee | User | null;
  assigneeId?: string | null;
  dueDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
  branchName?: string;
  commitSha?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed';
export type ProjectCategory = 'Frontend' | 'Backend' | 'Fullstack' | 'DevOps' | 'Mobile' | 'AI / ML';

export interface Project {
  id: string;
  _id?: string;
  name: string;
  description: string;
  category: ProjectCategory;
  color: string;
  status: ProjectStatus;
  progress?: number;
  totalTasks?: number;
  completedTasks?: number;
  stars?: number;
  forks?: number;
  openIssues?: number;
  openPRs?: number;
  owner?: User | Assignee | null;
  lead?: User | Assignee | null;
  leadId?: string | null;
  members?: (User | Assignee)[];
  repoUrl?: string;
  techStack: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  subtext: string;
  icon: 'clock' | 'git-pull-request' | 'git-commit' | 'zap' | 'check-circle' | 'award';
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'commit' | 'pr_merged' | 'pr_opened' | 'review' | 'deployment' | 'task_completed';
  user: Assignee;
  action: string;
  target: string;
  targetUrl?: string;
  project: string;
  timestamp: string;
  commitSha?: string;
  branch?: string;
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
  linesOfCode: string;
}

export interface DailyActivity {
  day: string;
  hours: number;
  commits: number;
  prs: number;
}

export type DeveloperStatus = 'focus' | 'coding' | 'reviewing' | 'meeting' | 'away';

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  handle: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  statusState: DeveloperStatus;
  statusMessage: string;
  weeklyFocusHours: number;
  focusGoalHours: number;
  streakDays: number;
  bestStreakDays: number;
  productivityScore: number;
  prsMerged: number;
  codeReviews: number;
  totalCommits: number;
  languages: LanguageStat[];
  weeklyActivity: DailyActivity[];
  badges: { id: string; name: string; icon: string; description: string; dateEarned: string }[];
}

export type ViewTab = 'dashboard' | 'projects' | 'tasks' | 'analytics' | 'activity' | 'profile';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    [key: string]: any;
  };
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface AiSuggestedTask {
  title: string;
  description: string;
  priority: TaskPriority;
  estimatedHours: number;
  tags: string[];
}
