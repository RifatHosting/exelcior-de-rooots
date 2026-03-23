import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AdminLogin.css';

const NAV = [
  { section: 'OVERVIEW', items: [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'orders', label: 'Orders', icon: '◈', badgeKey: 'adminUnread' },
    { id: 'chat', label: 'Chat', icon: '◉', badgeKey: 'adminUnread' },
  ]},
  { section: 'KONTEN', items: [
    { id: 'services', label: 'Services', icon: '⊛' },
    { id: 'portfolio', label: 'Portfolio', icon: '◫' },
  ]},
  { section: 'KONFIGURASI', items: [
    { id: 'settings', label: 'Pengaturan', icon: '⊙' },
  ]},
];

export default function AdminLayout({ children, tab, setTab }) {
  const { adminLogout, orders, notifications, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadOrders = orders.filter(o => o.adminUnread).length;
  const unreadNotif = notifications.filter(n => !n.read).length;

  const handleNav = (id) => {
    setTab(id);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__logo">
          <span className="green">&gt;</span> DevScale<span className="blink green">_</span>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Admin Console</div>
        </div>
        <nav className="admin-sidebar__nav">
          {NAV.map(group => (
            <React.Fragment key={group.section}>
              <div className="admin-sidebar__section">{group.section}</div>
              {group.items.map(item => {
                const badge = item.id === 'orders' || item.id === 'chat' ? unreadOrders : 0;
                return (
                  <button
                    key={item.id}
                    className={`admin-nav-link ${tab === item.id ? 'active' : ''}`}
                    onClick={() => handleNav(item.id)}
                  >
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span>{item.label}</span>
                    {badge > 0 && <span className="admin-nav-link__badge">{badge}</span>}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="status-dot" />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Online</span>
          </div>
          <button className="btn btn-xs btn-danger" onClick={handleLogout} style={{ width: '100%' }}>
            $ logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn btn-xs"
              style={{ display: 'none' }}
              id="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <span className="admin-topbar__title">
              <span className="green">admin@devscale</span>:<span className="muted">~/{tab}</span>
              <span className="blink green">_</span>
            </span>
          </div>
          <div className="admin-topbar__right">
            <div style={{ position: 'relative' }}>
              <button className="btn btn-xs" onClick={() => { setShowNotif(!showNotif); markAllNotificationsRead(); }}>
                🔔 {unreadNotif > 0 && <span style={{ color: 'var(--terminal-red)' }}>{unreadNotif}</span>}
              </button>
              {showNotif && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0,
                  width: 300, background: 'var(--bg-card)', border: '1px solid var(--border-bright)',
                  borderRadius: 'var(--radius)', zIndex: 100, maxHeight: 300, overflowY: 'auto',
                }}>
                  {notifications.slice(0, 15).map(n => (
                    <div key={n.id} style={{
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--border)',
                      fontSize: 11, color: n.read ? 'var(--text-muted)' : 'var(--text-primary)',
                    }}>
                      <div>{n.text}</div>
                      <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                        {new Date(n.createdAt).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div style={{ padding: 16, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                      Tidak ada notifikasi
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
