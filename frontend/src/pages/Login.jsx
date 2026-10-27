import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, LogIn, Lock, Mail, AlertCircle, Shield, UserCheck } from 'lucide-react';

const Login = () => {
  const { login, demoLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      await demoLogin(role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-md-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="agri-card p-4 p-md-5 shadow-sm border">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="bg-success text-white p-3 rounded-circle d-inline-flex mb-3 shadow-sm">
                <Sprout size={32} />
              </div>
              <h3 className="fw-bold brand-font mb-1">Welcome to AgriTech</h3>
              <p className="text-muted small">Sign in to access your farm dashboard and agro-intelligence</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-4" role="alert">
                <AlertCircle size={16} className="flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}

            {/* Quick Demo Access Bar */}
            <div className="p-3 bg-light rounded-3 mb-4 border">
              <span className="d-block small fw-bold text-secondary text-uppercase mb-2" style={{ fontSize: '0.7rem' }}>
                🚀 Fast Evaluator 1-Click Login:
              </span>
              <div className="d-grid gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('farmer')}
                  disabled={loading}
                  className="btn btn-outline-success btn-sm fw-semibold text-start d-flex align-items-center justify-content-between"
                >
                  <span>🌾 Demo Farmer (Gurpreet Singh)</span>
                  <span className="badge bg-success">Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  disabled={loading}
                  className="btn btn-outline-danger btn-sm fw-semibold text-start d-flex align-items-center justify-content-between"
                >
                  <span>🛡️ Platform Admin (Dr. Vikram Patel)</span>
                  <span className="badge bg-danger">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('expert')}
                  disabled={loading}
                  className="btn btn-outline-primary btn-sm fw-semibold text-start d-flex align-items-center justify-content-between"
                >
                  <span>👨‍🔬 Senior Agronomist (Dr. Sunita)</span>
                  <span className="badge bg-primary">Expert</span>
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center my-3">
              <hr className="flex-grow-1" />
              <span className="px-2 text-muted small">OR ENTER CREDENTIALS</span>
              <hr className="flex-grow-1" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="farmer@agritech.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-agri w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3 shadow-sm"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-muted small mt-3">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-success fw-bold text-decoration-none">
                Register as a Farmer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
