import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, UserPlus, Lock, Mail, User, Phone, MapPin, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    phone: '',
    region: '',
    state: '',
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        location: {
          region: formData.region,
          state: formData.state,
          country: 'India',
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-md-3">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-6">
          <div className="agri-card p-4 p-md-5 shadow-sm border">
            <div className="text-center mb-4">
              <div className="bg-success text-white p-3 rounded-circle d-inline-flex mb-3 shadow-sm">
                <Sprout size={32} />
              </div>
              <h3 className="fw-bold brand-font mb-1">Create AgriTech Account</h3>
              <p className="text-muted small">Join our smart agricultural network and access precision tools</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-4" role="alert">
                <AlertCircle size={16} className="flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-12">
                  <label className="form-label small fw-semibold">Select Account Role</label>
                  <div className="row g-2">
                    <div className="col-4">
                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="role-farmer"
                        value="farmer"
                        checked={formData.role === 'farmer'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-success w-100 py-2 small fw-bold" htmlFor="role-farmer">
                        🌾 Farmer
                      </label>
                    </div>
                    <div className="col-4">
                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="role-expert"
                        value="expert"
                        checked={formData.role === 'expert'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-primary w-100 py-2 small fw-bold" htmlFor="role-expert">
                        👨‍🔬 Expert
                      </label>
                    </div>
                    <div className="col-4">
                      <input
                        type="radio"
                        className="btn-check"
                        name="role"
                        id="role-admin"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={handleChange}
                      />
                      <label className="btn btn-outline-danger w-100 py-2 small fw-bold" htmlFor="role-admin">
                        🛡️ Admin
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted"><User size={16} /></span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. Ramesh Kumar"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted"><Mail size={16} /></span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="farmer@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Mobile Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted"><Phone size={16} /></span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">State / Province</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted"><MapPin size={16} /></span>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="e.g. Punjab, Maharashtra"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">District / Region</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Ludhiana, Nashik"
                    required
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label small fw-semibold">Password (min 6 characters)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted"><Lock size={16} /></span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="••••••••"
                      minLength={6}
                      required
                    />
                  </div>
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
                    <UserPlus size={18} />
                    Complete Registration
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-muted small mt-3">
              Already have an account?{' '}
              <Link to="/login" className="text-success fw-bold text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
