import React from 'react';
import { useApp } from '../context/AppContext.jsx';

const STATUS_COLOR = {
  pending: 'amber', in_progress: 'cyan', completed: 'green', cancelled: 'red'
};
const STATUS_LABEL = {
  pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled'
};

function StatCard({ label, value, sub, color }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 32, fontWeight: 800, color: color || 'var(--text-primary)' }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{sub}</span>}
    </div>
  );
}

export default function AdminDashboard({ setTab }) {
  const { orders, services, portfolio, notifications } = useApp();

  const total = orders.length;
  const pending = orders.filter(o => o.status === 'pending').length;
  const inProgress = orders.filter(o => o.status === 'in_progress').length;
  const completed = orders.filter(o => o.status === 'completed').length;
  const unread = orders.filter(o => o.adminUnread).length;
  const recent = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div>
        <p className="green" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 4 }}>// overview</p>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Dashboard</h2>
      </div>

      {/* Stats */}
      <div className="grid-4">
        <StatCard label="Total Orders" value={total} sub="Semua waktu" />
        <StatCard label="Pending" value={pending} sub="Butuh review" color="var(--terminal-amber)" />
        <StatCard label="In Progress" value={inProgress} sub="Sedang dikerjakan" color="var(--terminal-cyan)" />
        <StatCard label="Completed" value={completed} sub="Selesai" color="var(--terminal-green)" />
      </div>

      {/* Secondary stats */}
      <div className="grid-4">
        <StatCard label="Pesan Belum Dibaca" value={unread} color={unread > 0 ? 'var(--terminal-red)' : undefined} />
        <StatCard label="Layanan Aktif" value={services.filter(s => s.active).length} />
        <StatCard label="Portfolio" value={portfolio.length} />
        <StatCard label="Notifikasi" value={notifications.filter(n => !n.read).length} />
      </div>

      {/* Terminal activity log */}
      <div className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-dot red" /><span className="terminal-dot amber" /><span className="terminal-dot green" />
          <span className="terminal-title">activity_log — recent events</span>
        </div>
        <div className="terminal-body" style={{ maxHeight: 200, overflowY: 'auto' }}>
          {notifications.slice(0, 10).map(n => (
            <div key={n.id} style={{ marginBottom: 4 }}>
              <span className={n.type === 'order' ? 'green' : n.type === 'message' ? 'cyan' : 'amber'}>
                [{new Date(n.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}]
              </span>
              {' '}
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{n.text}</span>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="terminal-output">Belum ada aktivitas.</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p className="green" style={{ fontSize: 11, letterSpacing: '0.08em' }}>// recent_orders</p>
          <button className="btn btn-xs" onClick={() => setTab('orders')}>Lihat Semua →</button>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Order ID', 'Customer', 'Layanan', 'Status', 'Tanggal', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border)', background: o.adminUnread ? 'rgba(255,255,255,0.02)' : undefined }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--terminal-green)' }}>
                    {o.id.slice(0, 8).toUpperCase()}
                    {o.adminUnread && <span style={{ marginLeft: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--terminal-red)', display: 'inline-block' }} />}
                  </td>
                  <td style={{ padding: '10px 14px' }}>{o.customerName}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{o.serviceName}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`badge badge-${STATUS_COLOR[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 11 }}>
                    {new Date(o.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button className="btn btn-xs" onClick={() => setTab('orders')}>Detail</button>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Belum ada order.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
