import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const STATUS_COLOR = { pending: 'amber', in_progress: 'cyan', completed: 'green', cancelled: 'red' };

export default function AdminChat() {
  const { orders, messages, sendMessage, markThreadRead, uploadResultFile } = useApp();
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const chatRef = useRef(null);
  const fileRef = useRef(null);
  const resultFileRef = useRef(null);

  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const sorted = [...activeOrders].sort((a, b) => {
    if (a.adminUnread && !b.adminUnread) return -1;
    if (!a.adminUnread && b.adminUnread) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const activeOrder = activeOrderId ? orders.find(o => o.id === activeOrderId) : null;
  const thread = activeOrderId ? (messages[activeOrderId] || []) : [];

  useEffect(() => {
    if (activeOrderId) markThreadRead(activeOrderId, 'admin');
  }, [activeOrderId, messages]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [thread, activeOrderId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgText.trim() && !fileInput) return;
    if (!activeOrderId) return;
    if (fileInput) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const fd = { name: fileInput.name, size: fileInput.size, type: fileInput.type, data: ev.target.result };
        sendMessage(activeOrderId, msgText.trim(), 'admin', fd);
      };
      reader.readAsDataURL(fileInput);
    } else {
      sendMessage(activeOrderId, msgText.trim(), 'admin', null);
    }
    setMsgText('');
    setFileInput(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleResultUpload = (e) => {
    const f = e.target.files[0];
    if (!f || !activeOrderId) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      uploadResultFile(activeOrderId, { name: f.name, size: f.size, type: f.type, data: ev.target.result });
    };
    reader.readAsDataURL(f);
  };

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 120px)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      {/* Order list */}
      <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid var(--border)', overflowY: 'auto', background: 'var(--bg-secondary)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--terminal-green)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          // Semua Chat
        </div>
        {sorted.length === 0 && (
          <div style={{ padding: 24, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>Belum ada order.</div>
        )}
        {sorted.map(o => {
          const lastMsg = (messages[o.id] || []).slice(-1)[0];
          return (
            <div
              key={o.id}
              style={{
                padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                background: activeOrderId === o.id ? 'var(--bg-hover)' : o.adminUnread ? 'rgba(255,255,255,0.02)' : undefined,
                borderLeft: activeOrderId === o.id ? '2px solid var(--terminal-green)' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
              onClick={() => setActiveOrderId(o.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--terminal-green)' }}>{o.id.slice(0, 8).toUpperCase()}</span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {o.adminUnread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--terminal-red)', display: 'inline-block' }} />}
                  <span className={`badge badge-${STATUS_COLOR[o.status]}`} style={{ fontSize: 8 }}>{o.status}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{o.customerName}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{o.serviceName}</div>
              {lastMsg && (
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span style={{ color: lastMsg.sender === 'admin' ? 'var(--terminal-green)' : 'var(--terminal-cyan)' }}>
                    {lastMsg.sender === 'admin' ? 'Anda: ' : `${o.customerName}: `}
                  </span>
                  {lastMsg.file ? `📎 ${lastMsg.file.name}` : lastMsg.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chat area */}
      {!activeOrder && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 32 }}>◉</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pilih order untuk mulai chat</span>
        </div>
      )}
      {activeOrder && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--bg-card)' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{activeOrder.customerName}</span>
              <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>{activeOrder.customerEmail}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{activeOrder.serviceName}</span>
              {activeOrder.resultFile && (
                <span className="badge badge-green" style={{ fontSize: 9 }}>file uploaded</span>
              )}
              <input ref={resultFileRef} type="file" style={{ display: 'none' }} onChange={handleResultUpload} />
              <button className="btn btn-xs btn-green" onClick={() => resultFileRef.current?.click()}>↑ Kirim File Hasil</button>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {thread.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 60 }}>
                Belum ada pesan. Mulai chat dengan customer.
              </div>
            )}
            {thread.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%', padding: '8px 12px',
                  border: '1px solid var(--border-bright)', borderRadius: 'var(--radius)',
                  background: m.sender === 'admin' ? 'var(--bg-hover)' : 'var(--bg-secondary)',
                }}>
                  <div style={{ display: 'flex', gap: 8, fontSize: 10, marginBottom: 4 }}>
                    <span className={m.sender === 'admin' ? 'green' : 'cyan'}>
                      {m.sender === 'admin' ? '◎ Admin' : `◉ ${activeOrder.customerName}`}
                    </span>
                    <span className="muted">{new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {m.text && <p style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.text}</p>}
                  {m.file && (
                    <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      📎 {m.file.name}
                      {m.file.data && <a href={m.file.data} download={m.file.name} className="btn btn-xs btn-green">↓ Download</a>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                placeholder={`Balas ${activeOrder.customerName}...`}
                style={{ flex: 1 }}
              />
              <button type="button" className="btn btn-sm" onClick={() => fileRef.current?.click()}>📎</button>
              <button type="submit" className="btn btn-primary btn-sm">Kirim</button>
            </div>
            {fileInput && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11 }}>
                <span className="muted">📎 {fileInput.name}</span>
                <button type="button" className="btn btn-xs btn-danger" onClick={() => { setFileInput(null); fileRef.current.value = ''; }}>✗</button>
              </div>
            )}
            <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => setFileInput(e.target.files[0] || null)} />
          </form>
        </div>
      )}
    </div>
  );
}
