import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('agritech_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default auth headers for axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('agritech_token', token);
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('agritech_token');
      localStorage.removeItem('agritech_user');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get('/api/auth/profile');
      setUser(data);
      localStorage.setItem('agritech_user', JSON.stringify(data));
    } catch (err) {
      console.warn('Session expired or invalid token:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await axios.post('/api/auth/register', userData);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const updateProfile = async (profileData) => {
    const { data } = await axios.put('/api/auth/profile', profileData);
    setUser(data);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agritech_token');
    localStorage.removeItem('agritech_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Quick Demo Access helpers
  const demoLogin = async (role = 'farmer') => {
    const creds = {
      farmer: { email: 'farmer@agritech.com', password: 'farmer123' },
      admin: { email: 'admin@agritech.com', password: 'admin123' },
      expert: { email: 'expert@agritech.com', password: 'expert123' },
    };
    const target = creds[role] || creds.farmer;
    return await login(target.email, target.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        demoLogin,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        isExpert: user?.role === 'expert',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
