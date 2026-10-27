import ForumPost from '../models/ForumPost.js';

// @desc    Get all forum posts with filtering
// @route   GET /api/forum
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const posts = await ForumPost.find(query)
      .populate('author', 'name role avatar location')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single forum post by ID
// @route   GET /api/forum/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate('author', 'name role avatar location')
      .populate('comments.user', 'name role avatar');

    if (!post) {
      return res.status(404).json({ message: 'Discussion post not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new community post
// @route   POST /api/forum
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, category, content, tags } = req.body;

    const post = await ForumPost.create({
      author: req.user._id,
      title,
      category: category || 'General Discussion',
      content,
      tags: tags || [],
    });

    const populated = await ForumPost.findById(post._id).populate('author', 'name role avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment/reply to post
// @route   POST /api/forum/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content,
    });

    await post.save();

    const updated = await ForumPost.findById(post._id)
      .populate('author', 'name role avatar')
      .populate('comments.user', 'name role avatar');

    res.status(201).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on post
// @route   POST /api/forum/:id/like
// @access  Private
export const toggleLike = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const index = post.likes.indexOf(req.user._id);
    if (index === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ success: true, likesCount: post.likes.length, isLiked: index === -1 });
  } catch (error) {
    next(error);
  }
};
