import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const BLANK = {
  title: '', category: 'landing-page', description: '',
  tech: '', image: null, liveUrl: '', completedAt: '', featured: false,
};

function PortfolioForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || BLANK);
  const [preview, setPreview] = useState(initial?.image || null);
  const imgRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      set('image', ev.target.result);
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(f);
  };

  const handleSave = () => {
    if (!form.title || !form.description) {
      toast.error('Judul dan deskripsi wajib diisi', { className: 'toast-terminal' });
      return;
    }
    const tech = typeof form.tech === 'string' ? form.tech.split(',').map(s => s.trim()).filter(Boolean) : form.tech;
    onSave({ ...form, tech });
  };

  const techStr = Array.isArray(form.tech) ? form.tech.join(', ') : form.tech;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label className="label">Judul Project *</label><input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Warung Kopi Nusantara" /></div>
        <div>
          <label className="label">Kategori</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="landing-page">Landing Page</option>
            <option value="website">Website</option>
            <option value="app">App</option>
            <option value="microsite">Microsite</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        <div><label className="label">Teknologi (pisah koma)</label><input value={techStr} onChange={e => set('tech', e.target.value)} placeholder="React, Tailwind, GSAP" /></div>
        <div><label className="label">Tanggal Selesai</label><input type="date" value={form.completedAt} onChange={e => set('completedAt', e.target.value)} /></div>
        <div style={{ gridColumn: '1 / -1' }}><label className="label">URL Live Demo (opsional)</label><input value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://project.vercel.app" /></div>
      </div>
      <div><label className="label">Deskripsi *</label><textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} /></div>

      {/* Image upload */}
      <div>
        <label className="label">Screenshot / Thumbnail</label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {preview && (
            <img src={preview} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
          )}
          <div>
            <input ref={imgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
            <button type="button" className="btn btn-xs" onClick={() => imgRef.current?.click()}>↑ Upload Gambar</button>
            {preview && <button type="button" className="btn btn-xs btn-danger" style={{ marginLeft: 8 }} onClick={() => { set('image', null); setPreview(null); }}>Hapus</button>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" id="ptf-feat" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 16, height: 16 }} />
        <label htmlFor="ptf-feat" className="label" style={{ margin: 0 }}>Featured (tampil di homepage)</label>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>Simpan</button>
        <button className="btn btn-sm" onClick={onCancel}>Batal</button>
      </div>
    </div>
  );
}

export default function AdminPortfolio() {
  const { portfolio, addPortfolio, updatePortfolio, deletePortfolio } = useApp();
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(portfolio.map(p => p.category))];
  const filtered = filter === 'all' ? portfolio : portfolio.filter(p => p.category === filter);
  const sorted = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || new Date(b.completedAt) - new Date(a.completedAt));

  const handleSave = (data) => {
    if (editing === 'new') {
      addPortfolio(data);
      toast.success('Portfolio ditambahkan!', { className: 'toast-terminal' });
    } else {
      updatePortfolio(editing, data);
      toast.success('Portfolio diperbarui!', { className: 'toast-terminal' });
    }
    setEditing(null);
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Hapus portfolio "${title}"?`)) return;
    deletePortfolio(id);
    toast.success('Portfolio dihapus', { className: 'toast-terminal' });
  };

  const toggleFeatured = (item) => {
    updatePortfolio(item.id, { featured: !item.featured });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p className="green" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 4 }}>// portfolio</p>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>Manajemen Portfolio</h2>
        </div>
        {editing === null && (
          <button className="btn btn-primary btn-sm" onClick={() => setEditing('new')}>+ Tambah Portfolio</button>
        )}
      </div>

      {editing === 'new' && (
        <div className="card">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Tambah Portfolio Baru</h3>
          <PortfolioForm onSave={handleSave} onCancel={() => setEditing(null)} />
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} className={`btn btn-xs ${filter === c ? 'btn-primary' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-3">
        {sorted.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {editing === item.id ? (
              <>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Edit: {item.title}</h4>
                <PortfolioForm initial={item} onSave={handleSave} onCancel={() => setEditing(null)} />
              </>
            ) : (
              <>
                <div style={{ width: '100%', height: 120, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.image
                    ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span className="green" style={{ fontSize: 24, fontWeight: 800 }}>{'<'}/{'>'}</span>
                  }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span className="badge">{item.category}</span>
                  {item.featured && <span className="badge badge-amber">featured</span>}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</h3>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>{item.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(item.tech || []).map(t => <span key={t} className="badge" style={{ fontSize: 9 }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  <button className="btn btn-xs" onClick={() => toggleFeatured(item)}>
                    {item.featured ? '★ Unfeature' : '☆ Feature'}
                  </button>
                  <button className="btn btn-xs" onClick={() => setEditing(item.id)}>Edit</button>
                  <button className="btn btn-xs btn-danger" onClick={() => handleDelete(item.id, item.title)}>Hapus</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {sorted.length === 0 && !editing && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          Belum ada portfolio. Klik "+ Tambah Portfolio" untuk mulai.
        </div>
      )}
    </div>
  );
}
