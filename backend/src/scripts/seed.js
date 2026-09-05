const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting MongoDB database seeding...');
    await connectDB();

    // 1. Clear existing data
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
    ]);

    // 2. Seed Users
    console.log('👤 Seeding Users with credentials...');
    const usersData = [
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@devtrack.io',
        password: 'password123',
        handle: 'arivera',
        role: 'Principal Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        company: 'DevTrack Labs',
        location: 'San Francisco, CA',
        bio: 'Distributed systems architect & TypeScript enthusiast.',
      },
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@devtrack.io',
        password: 'password123',
        handle: 'schen',
        role: 'Staff Frontend Engineer',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        company: 'DevTrack Labs',
        location: 'Seattle, WA',
        bio: 'Design systems, Next.js, and CSS performance specialist.',
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@devtrack.io',
        password: 'password123',
        handle: 'erostova',
        role: 'Lead DevOps & Cloud Engineer',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        company: 'DevTrack Labs',
        location: 'Austin, TX',
        bio: 'Kubernetes, Terraform, and high availability systems.',
      },
      {
        name: 'Marcus Brody',
        email: 'marcus.brody@devtrack.io',
        password: 'password123',
        handle: 'mbrody',
        role: 'Senior Backend Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        company: 'DevTrack Labs',
        location: 'Boston, MA',
        bio: 'Node.js, GraphQL, Redis & database optimization.',
      },
    ];

    const createdUsers = await Promise.all(usersData.map((u) => User.create(u)));
    console.log(`✅ Seeded ${createdUsers.length} users with hashed passwords.`);

    const userMap = {
      alex: createdUsers[0]._id,
      sarah: createdUsers[1]._id,
      elena: createdUsers[2]._id,
      marcus: createdUsers[3]._id,
    };

    // 3. Seed Projects with relational User owner references
    console.log('📁 Seeding Projects...');
    const projectsData = [
      {
        name: 'Core Engine API',
        description: 'High-throughput microservice backend handling real-time developer telemetry and Git sync.',
        category: 'Backend',
        color: '#6366f1',
        status: 'on_track',
        owner: userMap.alex,
        repoUrl: 'https://github.com/devtrack/core-engine-api',
        techStack: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Docker'],
      },
      {
        name: 'DevTrack UI System',
        description: 'Modern component library and design system for all internal engineering dashboards.',
        category: 'Frontend',
        color: '#06b6d4',
        status: 'on_track',
        owner: userMap.sarah,
        repoUrl: 'https://github.com/devtrack/ui-system',
        techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Storybook'],
      },
      {
        name: 'Telemetry & Git Ingestion',
        description: 'Event-driven streaming worker for processing webhook payloads from GitHub and GitLab.',
        category: 'DevOps',
        color: '#10b981',
        status: 'at_risk',
        owner: userMap.elena,
        repoUrl: 'https://github.com/devtrack/telemetry-pipeline',
        techStack: ['Go', 'Kafka', 'Kubernetes', 'Prometheus', 'Grafana'],
      },
    ];

    const createdProjects = await Project.insertMany(projectsData);
    console.log(`✅ Seeded ${createdProjects.length} projects.`);

    const projMap = {
      coreEngine: createdProjects[0]._id,
      uiSystem: createdProjects[1]._id,
      telemetry: createdProjects[2]._id,
    };

    // 4. Seed Tasks with relational Project and User assignee references
    console.log('📝 Seeding Tasks...');
    const tasksData = [
      {
        title: 'Implement OAuth 2.0 and JWT token rotation',
        description: 'Set up stateless auth tokens with refresh cycle and redis-backed revocation blocklist.',
        status: 'in-progress',
        priority: 'urgent',
        project: projMap.coreEngine,
        assignee: userMap.alex,
        dueDate: '2025-03-05',
        tags: ['Auth', 'Security', 'Backend'],
        estimatedHours: 12,
        loggedHours: 8,
        branchName: 'feature/jwt-rotation',
        commitSha: 'a8f3b2c',
      },
      {
        title: 'Build Dark Mode glassmorphic tokens in Tailwind',
        description: 'Refactor color tokens to support dynamic HSL tint shifting and backdrop blur.',
        status: 'done',
        priority: 'high',
        project: projMap.uiSystem,
        assignee: userMap.sarah,
        dueDate: '2025-02-28',
        tags: ['UI', 'CSS', 'Design'],
        estimatedHours: 6,
        loggedHours: 6,
        branchName: 'style/glass-tokens',
        commitSha: '9e41fc7',
      },
      {
        title: 'Set up Prometheus scraping for GitHub Webhook latency',
        description: 'Create metrics middleware recording p95 and p99 ingress response times.',
        status: 'todo',
        priority: 'medium',
        project: projMap.telemetry,
        assignee: userMap.elena,
        dueDate: '2025-03-10',
        tags: ['Metrics', 'DevOps', 'Observability'],
        estimatedHours: 8,
        loggedHours: 0,
        branchName: 'infra/prometheus-metrics',
      },
      {
        title: 'Optimize Redis caching layer for user workspace feeds',
        description: 'Implement cache warming and TTL eviction strategies to achieve sub-10ms response times.',
        status: 'in-progress',
        priority: 'high',
        project: projMap.coreEngine,
        assignee: userMap.marcus,
        dueDate: '2025-03-08',
        tags: ['Performance', 'Redis', 'Backend'],
        estimatedHours: 10,
        loggedHours: 4,
        branchName: 'perf/redis-caching',
      },
      {
        title: 'Create KanBan board drag and drop interaction',
        description: 'Integrate accessible keyboard and pointer drag mechanics across sprint status columns.',
        status: 'todo',
        priority: 'medium',
        project: projMap.uiSystem,
        assignee: userMap.sarah,
        dueDate: '2025-03-12',
        tags: ['Frontend', 'Kanban', 'UX'],
        estimatedHours: 16,
        loggedHours: 0,
        branchName: 'feature/kanban-dnd',
      },
    ];

    const createdTasks = await Task.insertMany(tasksData);
    console.log(`✅ Seeded ${createdTasks.length} sprint tasks.`);

    console.log('🎉 Database successfully populated with initial DevTrack ecosystem data!');
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    await disconnectDB();
    process.exit(1);
  }
};

seedDatabase();
