const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: {
        values: ['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'AI / ML'],
        message: 'Category must be one of: Frontend, Backend, Fullstack, DevOps, Mobile, AI / ML',
      },
      default: 'Backend',
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#([0-9a-fA-F]{3}){1,2}$/, 'Color must be a valid hex code (e.g. #6366f1)'],
    },
    status: {
      type: String,
      enum: {
        values: ['on_track', 'at_risk', 'delayed', 'completed'],
        message: 'Status must be one of: on_track, at_risk, delayed, completed',
      },
      default: 'on_track',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    repoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    techStack: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.leadId = ret.owner ? (ret.owner._id ? ret.owner._id.toString() : ret.owner.toString()) : null;
        ret.lead = ret.owner;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.leadId = ret.owner ? (ret.owner._id ? ret.owner._id.toString() : ret.owner.toString()) : null;
        ret.lead = ret.owner;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
