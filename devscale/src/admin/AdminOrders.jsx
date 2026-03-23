import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const STATUS_COLOR = { pending: 'amber', in_progress: 'cyan', completed: 'green', cancelled: 'red' };
const STATUS_LABEL = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' };

function OrderDetail({ order, onClose }) {
  const { updateOrderStatus, messages, sendMessage, markThreadRead, uploadResultFile, updateOrder } = useApp();
  const [msgText, setMsgText] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const chatRef = useRef(null);
  const fileRef = useRef(null);
  const resultFileRef = useRef(null);

  const thread = messages[order.id] || [];

  useEffect(() => {
    markThreadRead(order.id, 'admin');
  }, [order.id]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [thread]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msgText.trim() && !fileInput) return;
    let fileData = null;
    if (fileInput) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        fileData = { name: fileInput.name, size: fileInput.size, type: fileInput.type, data: ev.target.result };
        sendMessage(order.id, msgText.trim(), 'admin', fileData);
      };
      reader.readAsDataURL(fileInput);
    } else {
      sendMessage(order.id, msgText.trim(), 'admin', null);
    }
    setMsgText('');
    setFileInput(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleResultFileUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const fileData = { name: f.name, size: f.size, type: f.type, data: ev.target.result };
      uploadResultFile(order.id, fileData);
      toast.success(`File "${f.name}" berhasil diupload!`, { className: 'toast-terminal' });
    };
    reader.readAsDataURL(f);
  };

  const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      z: 1000, display: 'flex', alignItems: 'stretch',
      zIndex: 999,
    }}>
      <div style={{ marginLeft: 'auto', width: '100%', maxWidth: 900, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <button className="btn btn-xs" onClick={onClose}>← Kembali</button>
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            Order <span className="green">{order.id.slice(0, 8).toUpperCase()}</span>
          </span>
          <span className={`badge badge-${STATUS_COLOR[order.status]}`}>{STATUS_LABEL[order.status]}</span>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Order info */}
          <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              ['Customer', order.customerName],
              ['Email', order.customerEmail],
              ['WhatsApp', order.customerWA || '-'],
              ['Layanan', order.serviceName],
              ['Project', order.projectTitle],
              ['Deadline', order.deadline || '-'],
              ['Budget', order.budget || '-'],
              ['Dibuat', new Date(order.createdAt).toLocaleString('id-ID')],
              ['Diperbarui', new Date(order.updatedAt).toLocaleString('id-ID')],
            ].map(([k, v]) => (
              <div key={k}>
                <span className="label">{k}</span>
                <span style={{ fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="card">
            <span className="label">Deskripsi Project</span>
            <p style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginTop: 6 }}>{order.projectDesc}</p>
            {order.projectRef && (
              <div style={{ marginTop: 12 }}>
                <span className="label">Referensi</span>
                <a href={order.projectRef} target="_blank" rel="noreferrer" className="green" style={{ fontSize: 12 }}>{order.projectRef}</a>
              </div>
            )}
            {order.notes && (
              <div style={{ marginTop: 12 }}>
                <span className="label">Catatan</span>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{order.notes}</p>
              </div>
            )}
          </div>

          {/* Status & Actions */}
          <div className="card" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <span className="label" style={{ marginBottom: 6 }}>Update Status</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {statuses.map(s => (
                  <button
                    key={s}
                    className={`btn btn-xs ${order.status === s ? `badge-${STATUS_COLOR[s]}` : ''}`}
                    style={order.status === s ? { borderColor: `var(--terminal-${STATUS_COLOR[s] === 'cyan' ? 'cyan' : STATUS_COLOR[s]})`, color: `var(--terminal-${STATUS_COLOR[s]})` } : {}}
                    onClick={() => { updateOrderStatus(order.id, s); toast.success(`Status diubah ke ${STATUS_LABEL[s]}`, { className: 'toast-terminal' }); }}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className="label" style={{ marginBottom: 6 }}>Upload File Hasil</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {order.resultFile && (
                  <span style={{ fontSize: 11, color: 'var(--terminal-green)' }}>✓ {order.resultFile.name}</span>
                )}
                <input ref={resultFileRef} type="file" style={{ display: 'none' }} onChange={handleResultFileUpload} />
                <button className="btn btn-xs btn-green" onClick={() => resultFileRef.current?.click()}>
                  ↑ Upload Hasil
                </button>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--terminal-green)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              // chat_customer
            </div>
            <div ref={chatRef} style={{ height: 280, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {thread.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 40 }}>Belum ada pesan.</div>
              )}
              {thread.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'admin' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '70%', padding: '8px 12px',
                    border: '1px solid var(--border-bright)', borderRadius: 'var(--radius)',
                    background: m.sender === 'admin' ? 'var(--bg-hover)' : 'var(--bg-card)',
                  }}>
                    <div style={{ display: 'flex', gap: 8, fontSize: 10, marginBottom: 4 }}>
                      <span className={m.sender === 'admin' ? 'green' : 'cyan'}>
                        {m.sender === 'admin' ? '◎ Admin' : '◉ Customer'}
                      </span>
                      <span className="muted">{new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {m.text && <p style={{ fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.text}</p>}
                    {m.file && (
                      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        📎 {m.file.name}
                        {m.file.data && (
                          <a href={m.file.data} download={m.file.name} className="btn btn-xs btn-green">↓</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  placeholder="Balas customer..."
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
              <input ref={fileRef} type="file" style={{ display: 'none' }}
                onChange={e => setFileInput(e.target.files[0] || null)} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const { orders } = useApp();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const statuses = ['all', 'pending', 'in_progress', 'completed', 'cancelled'];
  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.slice(0, 8).toUpperCase().includes(search.toUpperCase()) || o.serviceName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p className="green" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 4 }}>// orders</p>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Manajemen Order</h2>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {statuses.map(s => (
          <button key={s} className={`btn btn-xs ${filter === s ? 'btn-primary' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'Semua' : STATUS_LABEL[s]}
            {s !== 'all' && ` (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari order..."
          style={{ marginLeft: 'auto', width: 200 }}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Order ID', 'Customer', 'Layanan', 'Status', 'Tanggal', 'Msg', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}
                style={{ borderBottom: '1px solid var(--border)', background: o.adminUnread ? 'rgba(255,255,255,0.015)' : undefined, cursor: 'pointer' }}
                onClick={() => setSelected(o)}
              >
                <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--terminal-green)' }}>
                  {o.id.slice(0, 8).toUpperCase()}
                  {o.adminUnread && <span style={{ marginLeft: 6, display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--terminal-red)', verticalAlign: 'middle' }} />}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                </td>
                <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{o.serviceName}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span className={`badge badge-${STATUS_COLOR[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                </td>
                <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 11 }}>
                  {new Date(o.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {o.adminUnread && <span className="badge badge-red">baru</span>}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <button className="btn btn-xs" onClick={(e) => { e.stopPropagation(); setSelected(o); }}>Detail</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Tidak ada order.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <OrderDetail order={orders.find(o => o.id === selected.id) || selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
