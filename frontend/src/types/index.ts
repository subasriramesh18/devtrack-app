export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

export interface Assignee {
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  projectName: string;
  projectColor: string;
  assignee: Assignee;
  dueDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
  branchName?: string;
  commitSha?: string;
  createdAt: string;
}

export type ProjectStatus = 'on_track' | 'at_risk' | 'delayed' | 'completed';
export type ProjectCategory = 'Frontend' | 'Backend' | 'Fullstack' | 'DevOps' | 'Mobile' | 'AI / ML';

export interface Project {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  color: string;
  status: ProjectStatus;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  stars: number;
  forks: number;
  openIssues: number;
  openPRs: number;
  lead: Assignee;
  members: Assignee[];
  repoUrl: string;
  techStack: string[];
  updatedAt: string;
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
  name: string;
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
