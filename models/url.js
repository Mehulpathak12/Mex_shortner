const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true, 
    lowercase: true,
    trim: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  isOneTime: {
    type: Boolean,
    default: false
  },
  clickLimit: {
    type: Number,
    default: null
  },
  clickCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdByIp: {
    type: String,
    default: null
  }
}, {
  timestamps: { createdAt: true, updatedAt: true }
});

// Indexes for performance
urlSchema.index({ slug: 1 }, { unique: true });
urlSchema.index({ userId: 1 });
urlSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Url', urlSchema);
