import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FarmManagement from './pages/FarmManagement';
import CropMonitoring from './pages/CropMonitoring';
import WeatherAlerts from './pages/WeatherAlerts';
import Marketplace from './pages/Marketplace';
import OrderHistory from './pages/OrderHistory';
import CommunityForum from './pages/CommunityForum';
import ExpertConsultation from './pages/ExpertConsultation';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Farmer Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farms"
                  element={
                    <ProtectedRoute>
                      <FarmManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crops"
                  element={
                    <ProtectedRoute>
                      <CropMonitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consultations"
                  element={
                    <ProtectedRoute>
                      <ExpertConsultation />
                    </ProtectedRoute>
                  }
                />

                {/* Public / Semi-Public Agro Modules */}
                <Route path="/weather" element={<WeatherAlerts />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/forum" element={<CommunityForum />} />

                {/* Admin Only Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
