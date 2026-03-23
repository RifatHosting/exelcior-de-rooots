import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import './AdminLogin.css';

export default function AdminLogin() {
  const { adminLogin } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState([
    '> Initializing DevScale Admin Terminal...',
    '> Loading modules...',
    '> Authentication required.',
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLines(l => [...l, `> Authenticating user: ${form.username}...`]);
    await new Promise(r => setTimeout(r, 800));
    const ok = adminLogin(form.username, form.password);
    if (ok) {
      setLines(l => [...l, '> ✔ Access granted. Welcome, admin.']);
      toast.success('Login berhasil', { className: 'toast-terminal' });
      setTimeout(() => navigate('/admin/dashboard'), 500);
    } else {
      setLines(l => [...l, '> ✗ Access denied. Invalid credentials.']);
      toast.error('Username atau password salah', { className: 'toast-terminal' });
    }
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot red" />
            <span className="terminal-dot amber" />
            <span className="terminal-dot green" />
            <span className="terminal-title">admin@devscale:~$</span>
          </div>
          <div className="terminal-body admin-login__terminal">
            {lines.map((l, i) => (
              <div key={i} className="terminal-output" style={{ color: l.includes('✔') ? 'var(--terminal-green)' : l.includes('✗') ? 'var(--terminal-red)' : undefined }}>
                {l}
              </div>
            ))}
            <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div className="terminal-prompt" style={{ marginBottom: 12 }}>sudo login --admin</div>
              <form onSubmit={handleSubmit} className="admin-login__form">
                <div>
                  <label className="label">Username</label>
                  <input
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="admin"
                    autoFocus
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '◷ Authenticating...' : '$ Login →'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
          Default: admin / devscale2025
        </p>
      </div>
    </div>
  );
}
