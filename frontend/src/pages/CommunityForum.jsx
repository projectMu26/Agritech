import React, { useState, useEffect } from 'react';
import { getForumPosts, createForumPost, addForumComment, toggleForumLike } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Plus,
  Search,
  User,
  Send,
  Tag,
  Share2,
  CheckCircle2
} from 'lucide-react';

const CommunityForum = () => {
  const { isAuthenticated, user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Crop Diseases & Pests',
    content: '',
    tags: '',
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data } = await getForumPosts({
        category: category !== 'All' ? category : undefined,
        search: search || undefined,
      });
      setPosts(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to post in the community forum.');
      return;
    }

    try {
      const tagsArray = newPost.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await createForumPost({
        title: newPost.title,
        category: newPost.category,
        content: newPost.content,
        tags: tagsArray,
      });

      setShowNewModal(false);
      setNewPost({ title: '', category: 'Crop Diseases & Pests', content: '', tags: '' });
      loadPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit post');
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      alert('Please log in to reply.');
      return;
    }

    try {
      await addForumComment(postId, { content: commentText });
      setCommentText('');
      loadPosts();
    } catch (err) {
      alert('Failed to post reply');
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      alert('Please log in to like a discussion.');
      return;
    }

    try {
      await toggleForumLike(postId);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    'All',
    'Crop Diseases & Pests',
    'Soil & Fertilizers',
    'Weather & Irrigation',
    'Organic Farming',
    'Market Prices',
    'Farming Equipment',
  ];

  return (
    <div className="container py-4 my-2">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold brand-font mb-1">Kisan Community Forum & Discussion</h2>
          <p className="text-muted small mb-0">
            Connect with progressive farmers, agricultural university scientists, and peers.
          </p>
        </div>
        <button onClick={() => setShowNewModal(true)} className="btn btn-agri d-flex align-items-center gap-2 shadow-sm">
          <Plus size={18} /> Start New Discussion
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="agri-card p-3 mb-4 bg-white border">
        <div className="row g-3 align-items-center">
          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`btn btn-sm ${
                    category === cat ? 'btn-success fw-bold' : 'btn-light border text-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <form onSubmit={handleSearchSubmit} className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search topics, diseases, crops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-agri btn-sm">
                <Search size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="agri-card p-5 text-center text-muted">
          <MessageSquare size={48} className="opacity-50 mb-3" />
          <h5 className="fw-bold">No Discussions Found</h5>
          <p className="small mb-3">Be the first to ask a question or share field observations!</p>
          <button onClick={() => setShowNewModal(true)} className="btn btn-agri btn-sm">
            Start Discussion
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {posts.map((post) => {
            const isLikedByMe = post.likes?.some((id) => (typeof id === 'string' ? id : id?._id) === user?._id);
            const isReplying = activeReplyPostId === post._id;

            return (
              <div key={post._id} className="agri-card p-4 bg-white border">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={post.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt="author"
                      className="rounded-circle"
                      style={{ width: 44, height: 44, objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">{post.author?.name || 'Local Farmer'}</h6>
                      <small className="text-muted">
                        <span className={`badge ${post.author?.role === 'expert' ? 'bg-primary' : 'bg-success'} me-1`}>
                          {post.author?.role || 'Farmer'}
                        </span>
                        {post.author?.location?.region || 'Punjab'} &bull; {new Date(post.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <span className="badge bg-light text-secondary border">{post.category}</span>
                </div>

                <h5 className="fw-bold brand-font text-dark mt-2 mb-2">{post.title}</h5>
                <p className="text-secondary leading-relaxed mb-3">{post.content}</p>

                {post.tags && post.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="badge bg-light text-muted border small">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="d-flex align-items-center justify-content-between border-top pt-3">
                  <div className="d-flex align-items-center gap-3">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`btn btn-sm d-flex align-items-center gap-1 ${
                        isLikedByMe ? 'btn-success' : 'btn-outline-secondary'
                      }`}
                    >
                      <ThumbsUp size={14} />
                      <span>{post.likes?.length || 0} Helpful</span>
                    </button>

                    <button
                      onClick={() => setActiveReplyPostId(isReplying ? null : post._id)}
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    >
                      <MessageCircle size={14} />
                      <span>{post.comments?.length || 0} Replies</span>
                    </button>
                  </div>
                </div>

                {/* Comments / Replies Section */}
                {isReplying && (
                  <div className="mt-3 pt-3 border-top bg-light p-3 rounded-3">
                    <h6 className="fw-bold small mb-3">Replies & Expert Advice ({post.comments?.length || 0})</h6>

                    {post.comments?.length > 0 && (
                      <div className="d-flex flex-column gap-2 mb-3">
                        {post.comments.map((comment, cIdx) => (
                          <div key={cIdx} className="p-3 bg-white rounded-2 border">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <strong className="small text-dark">{comment.authorName}</strong>
                              <span className={`badge ${comment.authorRole === 'expert' ? 'bg-primary' : 'bg-light text-dark'}`}>
                                {comment.authorRole}
                              </span>
                            </div>
                            <p className="small text-secondary mb-0">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add reply input */}
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Write your farmer experience or answer..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="btn btn-success btn-sm d-flex align-items-center gap-1"
                      >
                        <Send size={14} /> Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Start Discussion */}
      {showNewModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Start New Farmer Discussion</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowNewModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePost}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Discussion Title</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Best organic spray for whitefly control in cotton crop"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Topic Category</label>
                    <select
                      className="form-select"
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    >
                      <option value="Crop Diseases & Pests">Crop Diseases & Pests</option>
                      <option value="Soil & Fertilizers">Soil & Fertilizers</option>
                      <option value="Weather & Irrigation">Weather & Irrigation</option>
                      <option value="Organic Farming">Organic Farming</option>
                      <option value="Market Prices">Market Prices</option>
                      <option value="Farming Equipment">Farming Equipment</option>
                      <option value="General Discussion">General Discussion</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Detailed Query or Experience</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Describe symptoms, seed variety, acreage, and any treatments attempted..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Cotton, Whitefly, NeemOil, BioControl"
                      value={newPost.tags}
                      onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowNewModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-agri btn-sm">
                    Publish Discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum;
