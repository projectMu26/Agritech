import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'farmer' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

const forumPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Crop Diseases & Pests', 'Soil & Fertilizers', 'Weather & Irrigation', 'Organic Farming', 'Market Prices', 'Farming Equipment', 'General Discussion'],
      default: 'General Discussion',
    },
    content: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

export default ForumPost;
