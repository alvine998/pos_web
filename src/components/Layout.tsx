import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  User,
  Package,
  Boxes,
  LayoutGrid,
  Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logout Berhasil', 'info');
  };
  const allNavItems = [
    { icon: LayoutDashboard, label: 'Beranda', path: '/dashboard', roles: ['Admin'] },
    { icon: Package, label: 'Produk', path: '/products', roles: ['Admin'] },
    { icon: LayoutGrid, label: 'Kategori', path: '/categories', roles: ['Admin'] },
    { icon: Boxes, label: 'Stok', path: '/inventory', roles: ['Admin'] },
    { icon: ShoppingCart, label: 'Transaksi', path: '/transaction', roles: ['Admin', 'Cashier', 'Waiter'] },
    { icon: BarChart3, label: 'Laporan', path: '/reports', roles: ['Admin', 'Cashier'] },
    { icon: Settings, label: 'Pengaturan', path: '/settings', roles: ['Admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="layout">
      <div
        className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <ShoppingCart size={32} />
            <span>Sistem POS</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="username">{user?.name || 'User'}</span>
              <span className="role">{user?.role || 'Staff'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="menu-toggle" onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <h1>{navItems.find(item => window.location.pathname.includes(item.path))?.label || 'Beranda'}</h1>
          </div>
          <div className="header-actions">
            <span className="current-date" style={{ display: 'none' }}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>
        <section className="content">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
