import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transaction from './pages/Transaction';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import StoreProfile from './pages/settings/StoreProfile';
import Payments from './pages/settings/Payments';
import Notifications from './pages/settings/Notifications';
import StaffManagement from './pages/settings/StaffManagement';
import Security from './pages/settings/Security';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import { POSProvider } from './context/POSContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Memuat...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    // If user is logged in but doesn't have the role, redirect to their default page
    if (user?.role === 'Admin') return <Navigate to="/dashboard" />;
    return <Navigate to="/transaction" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <POSProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/products"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <Products />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <Categories />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <Inventory />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Cashier', 'Waiter']}>
                    <Layout>
                      <Transaction />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Cashier']}>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/profile"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <StoreProfile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/payments"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <Payments />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/notifications"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/staff"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <StaffManagement />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/security"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Layout>
                      <Security />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </BrowserRouter>
        </POSProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
