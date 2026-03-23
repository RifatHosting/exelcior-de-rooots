import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { siteConfig, setSiteConfig } = useApp();
  const [form, setForm] = useState({ ...siteConfig });
  const [logoPreview, setLogoPreview] = useState(siteConfig.logo || null);
  const logoRef = useRef(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogoUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      set('logo', ev.target.result);
      setLogoPreview(ev.target.result);
      toast.success('Logo diupload. Klik Simpan untuk menyimpan.', { className: 'toast-terminal' });
    };
    reader.readAsDataURL(f);
  };

  const handleRemoveLogo = () => {
    set('logo', null);
    setLogoPreview(null);
    if (logoRef.current) logoRef.current.value = '';
  };

  const handleSave = () => {
    setSiteConfig(form);
    toast.success('Pengaturan disimpan!', { className: 'toast-terminal' });
  };

  const handleReset = () => {
    if (!window.confirm('Reset ke pengaturan awal?')) return;
    const defaults = {
      siteName: 'DevScale', tagline: 'Professional Frontend Development Services',
      logo: null, adminEmail: 'admin@devscale.id', whatsapp: '6281234567890',
      instagram: '@devscale.id', footerText: '© 2025 DevScale. All rights reserved.',
      heroTitle: 'Build. Scale. Ship.', heroSubtitle: 'Jasa pembuatan website frontend profesional. Mulai dari Rp 150.000.',
      accentColor: '#00ff41',
    };
    setForm(defaults);
    setLogoPreview(null);
    setSiteConfig(defaults);
    toast.success('Reset ke default', { className: 'toast-terminal' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 800 }}>
      <div>
        <p className="green" style={{ fontSize: 11, letterSpacing: '0.1em', marginBottom: 4 }}>// settings</p>
        <h2 style={{ fontSize: 22, fontWeight: 800 }}>Pengaturan Website</h2>
      </div>

      {/* Logo */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--terminal-green)' }}>// Logo Website</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 120, height: 60, border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius)', background: 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          }}>
            {logoPreview
              ? <img src={logoPreview} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No Logo</span>
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
            <button className="btn btn-xs btn-green" onClick={() => logoRef.current?.click()}>↑ Upload Logo</button>
            {logoPreview && (
              <button className="btn btn-xs btn-danger" onClick={handleRemoveLogo}>✗ Hapus Logo</button>
            )}
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>PNG/SVG transparan direkomendasikan</p>
          </div>
        </div>
      </div>

      {/* Identitas */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--terminal-green)' }}>// Identitas Website</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label className="label">Nama Website</label><input value={form.siteName} onChange={e => set('siteName', e.target.value)} /></div>
          <div><label className="label">Tagline</label><input value={form.tagline} onChange={e => set('tagline', e.target.value)} /></div>
          <div style={{ gridColumn: '1 / -1' }}><label className="label">Hero Title</label><input value={form.heroTitle} onChange={e => set('heroTitle', e.target.value)} /></div>
          <div style={{ gridColumn: '1 / -1' }}><label className="label">Hero Subtitle</label><input value={form.heroSubtitle} onChange={e => set('heroSubtitle', e.target.value)} /></div>
          <div style={{ gridColumn: '1 / -1' }}><label className="label">Footer Text</label><input value={form.footerText} onChange={e => set('footerText', e.target.value)} /></div>
        </div>
      </div>

      {/* Kontak */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--terminal-green)' }}>// Kontak & Sosial Media</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label className="label">Email Admin</label><input value={form.adminEmail} onChange={e => set('adminEmail', e.target.value)} /></div>
          <div><label className="label">WhatsApp (format: 628xxx)</label><input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="6281234567890" /></div>
          <div><label className="label">Instagram</label><input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@username" /></div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: 'var(--terminal-red)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--terminal-red)' }}>// Danger Zone</h3>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Reset semua pengaturan ke nilai default. Data orders dan portfolio tidak terpengaruh.</p>
        <button className="btn btn-danger btn-sm" style={{ alignSelf: 'flex-start' }} onClick={handleReset}>Reset Pengaturan</button>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary" onClick={handleSave}>✓ Simpan Semua Perubahan</button>
        <button className="btn" onClick={() => { setForm({ ...siteConfig }); setLogoPreview(siteConfig.logo || null); }}>Batalkan</button>
      </div>
    </div>
  );
}
