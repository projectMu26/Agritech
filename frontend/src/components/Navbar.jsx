import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, CloudSun, ShoppingBag, Users, MessageSquare, Shield, LogOut, LogIn, Globe } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { lang, switchLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg agri-navbar py-2 shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <div className="bg-success text-white p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 42, height: 42 }}>
            <Sprout size={24} />
          </div>
          <div>
            <span className="fs-4 fw-bold text-success brand-font m-0 d-block leading-tight">
              {t('brand')}
            </span>
            <small className="text-muted d-none d-sm-block" style={{ fontSize: '0.72rem' }}>
              Precision Smart Farming
            </small>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#agriNavbarContent"
          aria-controls="agriNavbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="agriNavbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active text-success fw-bold' : ''}`} to="/">
                {t('nav.home')}
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/dashboard') ? 'active text-success fw-bold' : ''}`} to="/dashboard">
                    {t('nav.dashboard')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/farms') ? 'active text-success fw-bold' : ''}`} to="/farms">
                    {t('nav.farms')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/crops') ? 'active text-success fw-bold' : ''}`} to="/crops">
                    {t('nav.crops')}
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/weather') ? 'active text-success fw-bold' : ''}`} to="/weather">
                {t('nav.weather')}
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/marketplace') ? 'active text-success fw-bold' : ''}`} to="/marketplace">
                {t('nav.marketplace')}
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/forum') ? 'active text-success fw-bold' : ''}`} to="/forum">
                {t('nav.forum')}
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/consultations') ? 'active text-success fw-bold' : ''}`} to="/consultations">
                {t('nav.consultation')}
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link className={`nav-link text-danger fw-bold ${isActive('/admin') ? 'active' : ''}`} to="/admin">
                  <Shield size={16} className="me-1 inline" />
                  {t('nav.admin')}
                </Link>
              </li>
            )}
          </ul>

          {/* Right Section: Language Switcher & Auth */}
          <div className="d-flex align-items-center gap-3">
            {/* Language Selector */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-light border d-flex align-items-center gap-1 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Globe size={15} className="text-secondary" />
                <span className="fw-semibold text-uppercase">{lang}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                <li>
                  <button
                    className={`dropdown-item ${lang === 'en' ? 'active bg-success' : ''}`}
                    onClick={() => switchLanguage('en')}
                  >
                    🇺🇸 English (Default)
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${lang === 'hi' ? 'active bg-success' : ''}`}
                    onClick={() => switchLanguage('hi')}
                  >
                    🇮🇳 हिंदी (Hindi)
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${lang === 'es' ? 'active bg-success' : ''}`}
                    onClick={() => switchLanguage('es')}
                  >
                    🇪🇸 Español (Spanish)
                  </button>
                </li>
              </ul>
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-2 dropdown-toggle py-1 px-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: 26, height: 26, objectFit: 'cover' }}
                  />
                  <span className="fw-semibold d-none d-md-inline" style={{ maxWidth: 100, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : user?.role === 'expert' ? 'bg-primary' : 'bg-success'}`}>
                    {user?.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <Sprout size={16} className="me-2 text-success" />
                      {t('nav.dashboard')}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <ShoppingBag size={16} className="me-2 text-primary" />
                      {t('nav.orders')}
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item text-danger" to="/admin">
                        <Shield size={16} className="me-2" />
                        {t('nav.admin')}
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <LogOut size={16} className="me-2" />
                      {t('nav.logout')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-agri">
                  <LogIn size={15} className="me-1" />
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-sm btn-agri">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
