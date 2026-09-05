const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'done'],
        message: "Status must be one of: 'todo', 'in-progress', or 'done'",
      },
      default: 'todo',
      set: (v) => {
        if (!v) return 'todo';
        const normalized = v.toLowerCase().replace('_', '-');
        return normalized === 'in-progress' || normalized === 'todo' || normalized === 'done'
          ? normalized
          : v;
      },
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: "Priority must be one of: 'low', 'medium', 'high', 'urgent'",
      },
      default: 'medium',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    dueDate: {
      type: String,
      trim: true,
      default: () => new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    },
    tags: {
      type: [String],
      default: [],
    },
    estimatedHours: {
      type: Number,
      min: [0, 'estimatedHours must be a non-negative number'],
      default: 0,
    },
    loggedHours: {
      type: Number,
      min: [0, 'loggedHours must be a non-negative number'],
      default: 0,
    },
    branchName: {
      type: String,
      trim: true,
      default: '',
    },
    commitSha: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.projectId = ret.project
          ? ret.project._id
            ? ret.project._id.toString()
            : ret.project.toString()
          : null;
        ret.assigneeId = ret.assignee
          ? ret.assignee._id
            ? ret.assignee._id.toString()
            : ret.assignee.toString()
          : null;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.projectId = ret.project
          ? ret.project._id
            ? ret.project._id.toString()
            : ret.project.toString()
          : null;
        ret.assigneeId = ret.assignee
          ? ret.assignee._id
            ? ret.assignee._id.toString()
            : ret.assignee.toString()
          : null;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
