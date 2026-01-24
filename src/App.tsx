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

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Memuat...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

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
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Products />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Categories />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Inventory />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Transaction />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Reports />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/profile"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <StoreProfile />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/payments"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Payments />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/notifications"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/staff"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <StaffManagement />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/security"
                element={
                  <ProtectedRoute>
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
