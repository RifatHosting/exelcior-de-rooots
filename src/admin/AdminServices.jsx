import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const BLANK = {
  name: '', slug: '', price: '', priceMax: '', category: 'landing-page',
  badge: '', badgeColor: '', description: '', features: '', deliverables: '',
  active: true, order: 99,
};

function ServiceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.description) {
      toast.error('Nama dan deskripsi wajib diisi', { className: 'toast-terminal' });
      return;
    }
    const features = typeof form.features === 'string' ? form.features.split('\n').map(s => s.trim()).filter(Boolean) : form.features;
    const deliverables = typeof form.deliverables === 'string' ? form.deliverables.split('\n').map(s => s.trim()).filter(Boolean) : form.deliverables;
    onSave({
      ...form,
      price: Number(form.price) || 0,
      priceMax: form.priceMax ? Number(form.priceMax) : null,
      features,
      deliverables,
    });
  };

  const featuresStr = Array.isArray(form.features) ? form.features.join('\n') : form.features;
  const deliverablesStr = Array.isArray(form.deliverables) ? form.deliverables.join('\n') : form.deliverables;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label className="label">Nama Layanan *</label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Landing Page Basic" /></div>
        <div><label className="label">Slug</label><input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="landing-page-basic" /></div>
        <div><label className="label">Harga Minimum (Rp)</label><input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="150000" /></div>
        <div><label className="label">Harga Maksimum (Rp, opsional)</label><input type="number" value={form.priceMax || ''} onChange={e => set('priceMax', e.target.value)} placeholder="350000" /></div>
        <div>
          <label className="label">Kategori</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="landing-page">Landing Page</option>
            <option value="website">Website</option>
            <option value="app">App</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div><label className="label">Badge Label</label><input value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="POPULER" /></div>
          <div>
            <label className="label">Badge Warna</label>
            <select value={form.badgeColor} onChange={e => set('badgeColor', e.target.value)}>
              <option value="">Default</option>
              <option value="green">Green</option>
              <option value="amber">Amber</option>
              <option value="red">Red</option>
            </select>
          </div>
        </div>
      </div>
      <div><label className="label">Deskripsi *</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} /></div>
      <div><label className="label">Fitur (satu per baris)</label><textarea value={featuresStr} onChange={e => set('features', e.target.value)} rows={5} placeholder={'1 halaman responsif\nMobile friendly\nRevisi 2x'} /></div>
      <div><label className="label">Deliverables (satu per baris)</label><textarea value={deliverablesStr} onChange={e => set('deliverables', e.target.value)} rows={3} placeholder={'Source code (.zip)\nFile HTML deploy-ready'} /></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" id="svc-active" checked={form.active} onChange={e => set('active', e.target.checked)} style={{ width: 16, height: 16 }} />
        <label htmlFor="svc-active" className="label" style={{ margin: 0 }}>Aktif (tampil di website)</label>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>Simpan</button>
        <button className="btn btn-sm" onClick={onCancel}>Batal</button>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const { services, addService, updateService, deleteService } = useApp();
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const sorted = [...services].sort((a, b) => a.order - b.order);

  const handleSave = (data) => {
    if (editing === 'new') {
      addService(data);
      toast.success('Layanan ditambahkan!', { className: 'toast-terminal' });
    } else {
      updateService(editing, data);
      toast.success('Layanan diperbarui!', { className: 'toast-terminal' });
    }
    setEditing(null);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Hapus layanan "${name}"?`)) return;
    deleteService(id);
    toast.success('Layanan dihapus', { className: 'toast-terminal' });
  };

  const toggleActive = (svc) => {
    updateService(svc.id, { active: !svc.active });
    toast.success(svc.active ? 'Layanan dinonaktifkan' : 'Layanan diaktifkan', { className: 'toast-terminal' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p className="green" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 4 }}>// services</p>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Manajemen Layanan</h2>
        </div>
        {editing === null && (
          <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>+ Tambah Layanan</button>
        )}
      </div>

      {editing === 'new' && (
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Tambah Layanan Baru</h3>
          <ServiceForm onSave={handleSave} onCancel={() => setEditing(null)} />
        </div>
      )}

      {sorted.map(svc => (
        <div key={svc.id} className="card" style={{ opacity: svc.active ? 1 : 0.5 }}>
          {editing === svc.id ? (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Edit: {svc.name}</h3>
              <ServiceForm initial={{
                ...svc,
                features: Array.isArray(svc.features) ? svc.features.join('\n') : svc.features,
                deliverables: Array.isArray(svc.deliverables) ? svc.deliverables.join('\n') : svc.deliverables,
              }} onSave={handleSave} onCancel={() => setEditing(null)} />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700 }}>{svc.name}</h3>
                  {svc.badge && <span className={`badge badge-${svc.badgeColor}`}>{svc.badge}</span>}
                  {!svc.active && <span className="badge badge-red">NONAKTIF</span>}
                  <span className="badge">{svc.category}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--terminal-green)' }}>
                  {svc.price === 0 ? 'Harga Negosiasi' : `Rp ${Number(svc.price).toLocaleString('id-ID')}${svc.priceMax ? ` – Rp ${Number(svc.priceMax).toLocaleString('id-ID')}` : ''}`}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 600 }}>{svc.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {(svc.features || []).map(f => <span key={f} className="badge" style={{ fontSize: 9 }}>{f}</span>)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn btn-xs" onClick={() => toggleActive(svc)}>
                  {svc.active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button className="btn btn-xs" onClick={() => setEditing(svc.id)}>Edit</button>
                <button className="btn btn-xs btn-danger" onClick={() => handleDelete(svc.id, svc.name)}>Hapus</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
