import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import './TrackPage.css';

const STATUS_MAP = {
  pending: { label: 'Menunggu Review', color: 'amber', icon: '◷' },
  in_progress: { label: 'Sedang Dikerjakan', color: 'cyan', icon: '◈' },
  completed: { label: 'Selesai', color: 'green', icon: '✓' },
  cancelled: { label: 'Dibatalkan', color: 'red', icon: '✗' },
};

export default function TrackPage() {
  const { orders, messages, sendMessage, markThreadRead, siteConfig } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputId, setInputId] = useState('');
  const [order, setOrder] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const chatRef = useRef(null);
  const fileRef = useRef(null);

  // Look up by short ID (first 8 chars) or full UUID
  const findOrder = (id) => {
    const clean = id.trim().toUpperCase();
    return orders.find(o => o.id.slice(0, 8).toUpperCase() === clean || o.id.toUpperCase() === clean);
  };

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      const found = findOrder(idParam);
      if (found) {
        setOrder(found);
        markThreadRead(found.id, 'customer');
      }
    }
  }, [searchParams, orders]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, order]);

  // Refresh order from orders list
  useEffect(() => {
    if (order) {
      const fresh = orders.find(o => o.id === order.id);
      if (fresh) setOrder(fresh);
    }
  }, [orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    const found = findOrder(inputId);
    if (found) {
      setOrder(found);
      markThreadRead(found.id, 'customer');
      setSearchParams({ id: found.id });
    } else {
      toast.error('Order ID tidak ditemukan', { className: 'toast-terminal' });
    }
  };

  const handleSendMsg = (e) => {
    e.preventDefault();
    if (!msgText.trim() && !fileInput) return;
    let fileData = null;
    if (fileInput) {
      fileData = { name: fileInput.name, size: fileInput.size, type: fileInput.type };
    }
    sendMessage(order.id, msgText.trim(), 'customer', fileData);
    setMsgText('');
    setFileInput(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const threadMsgs = order ? (messages[order.id] || []) : [];
  const status = order ? STATUS_MAP[order.status] : null;

  return (
    <div className="track-page">
      <div className="container">
        <div className="track-header">
          <p className="green" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>// track_order</p>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 800, marginBottom: 8 }}>Track & Chat</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Masukkan Order ID untuk melihat status dan chat dengan admin.</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="track-search">
          <input
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            placeholder="Masukkan Order ID (contoh: A1B2C3D4)"
            style={{ maxWidth: 360 }}
          />
          <button type="submit" className="btn btn-primary btn-sm">$ track</button>
        </form>

        {!order && (
          <div className="track-empty terminal-window" style={{ marginTop: 32 }}>
            <div className="terminal-header">
              <span className="terminal-dot red" /><span className="terminal-dot amber" /><span className="terminal-dot green" />
              <span className="terminal-title">awaiting_input</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-prompt">track --order-id &lt;YOUR_ORDER_ID&gt;</div>
              <div className="terminal-output">Masukkan Order ID dari email konfirmasi Anda.</div>
              <div className="terminal-output" style={{ marginTop: 4 }}>
                Butuh bantuan? Chat via{' '}
                <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer" className="green">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

        {order && (
          <div className="track-content fade-in">
            {/* Order info */}
            <div className="track-info card">
              <div className="track-info-header">
                <div>
                  <span className="label">Order ID</span>
                  <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.04em' }}>
                    {order.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className={`track-status track-status--${status.color}`}>
                  <span>{status.icon}</span>
                  <span>{status.label}</span>
                </div>
              </div>
              <div className="divider" style={{ margin: '12px 0' }} />
              <div className="track-info-grid">
                <div><span className="label">Layanan</span><strong>{order.serviceName}</strong></div>
                <div><span className="label">Customer</span><strong>{order.customerName}</strong></div>
                <div><span className="label">Project</span><strong>{order.projectTitle}</strong></div>
                <div><span className="label">Dibuat</span><strong>{new Date(order.createdAt).toLocaleDateString('id-ID')}</strong></div>
              </div>

              {/* Result file download */}
              {order.resultFile && (
                <div className="track-result-file">
                  <span className="green">✓</span>
                  <span>File hasil tersedia:</span>
                  <a
                    href={order.resultFile.data || '#'}
                    download={order.resultFile.name}
                    className="btn btn-green btn-xs"
                  >
                    ↓ {order.resultFile.name}
                  </a>
                </div>
              )}
            </div>

            {/* Chat */}
            <div className="track-chat card">
              <div className="track-chat-header">
                <span className="green" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  // chat_admin
                </span>
                {order.customerUnread && (
                  <span className="badge badge-green">pesan baru</span>
                )}
              </div>
              <div className="track-chat-msgs" ref={chatRef}>
                {threadMsgs.length === 0 && (
                  <div className="track-chat-empty">
                    <span className="muted">Belum ada pesan. Mulai chat untuk diskusi project Anda.</span>
                  </div>
                )}
                {threadMsgs.map(m => (
                  <div key={m.id} className={`track-msg track-msg--${m.sender}`}>
                    <div className="track-msg-bubble">
                      <div className="track-msg-meta">
                        <span className={m.sender === 'admin' ? 'green' : 'cyan'}>
                          {m.sender === 'admin' ? '◎ Admin' : '◉ You'}
                        </span>
                        <span className="muted" style={{ fontSize: 10 }}>
                          {new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {m.text && <p className="track-msg-text">{m.text}</p>}
                      {m.file && (
                        <div className="track-msg-file">
                          <span>📎 {m.file.name}</span>
                          {m.file.data && (
                            <a href={m.file.data} download={m.file.name} className="btn btn-xs btn-green">↓ Download</a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {order.status !== 'cancelled' && order.status !== 'completed' && (
                <form onSubmit={handleSendMsg} className="track-chat-input">
                  <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                    <input
                      value={msgText}
                      onChange={e => setMsgText(e.target.value)}
                      placeholder="Tulis pesan ke admin..."
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => fileRef.current?.click()}
                      title="Lampirkan file"
                    >
                      📎
                    </button>
                  </div>
                  {fileInput && (
                    <div className="track-file-preview">
                      <span className="muted">📎 {fileInput.name}</span>
                      <button type="button" className="btn btn-xs btn-danger" onClick={() => { setFileInput(null); if (fileRef.current) fileRef.current.value = ''; }}>✗</button>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => setFileInput(e.target.files[0] || null)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Kirim →</button>
                </form>
              )}
              {(order.status === 'completed' || order.status === 'cancelled') && (
                <div className="track-chat-closed">
                  <span className="muted">Chat ditutup — order {order.status}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
