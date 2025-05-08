import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './js/context/AuthContext';
import Layout from './js/components/layout/Layout';
import ProtectedRoute from './js/components/common/ProtectedRoute';

// Pages
import Home from './js/pages/Home';
import MapPage from './js/pages/MapPage';
import Login from './js/pages/Login';
import Register from './js/pages/Register';
import Profile from './js/pages/Profile';
import Dashboard from './js/pages/Dashboard';
import UserDashboard from './js/pages/UserDashboard';
import ServiceProviderDashboard from './js/pages/ServiceProviderDashboard';
import AdminDashboard from './js/pages/AdminDashboard';
import ServiceDetails from './js/pages/ServiceDetails';
import NotFound from './js/pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="map" element={<MapPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="services/:categoryId" element={<ServiceDetails />} />
            <Route path="profile/:userId" element={<Profile />} />
          </Route>

          {/* Protected Routes - Any logged in user */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile/edit" element={<Profile isEditing={true} />} />
          </Route>

          {/* User Dashboard Routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<UserDashboard />} />
          </Route>

          {/* Service Provider Dashboard Routes */}
          <Route path="/provider" element={
            <ProtectedRoute allowedRoles={['service_provider']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<ServiceProviderDashboard />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;