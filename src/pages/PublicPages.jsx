// ServicesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function fmtPrice(n) { return 'Rp ' + n.toLocaleString('id-ID'); }

export function ServicesPage() {
  const { services } = useApp();
  const active = services.filter(s => s.active).sort((a, b) => a.order - b.order);

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        <p className="green" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>// services</p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, marginBottom: 8 }}>Semua Layanan</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 48 }}>
          Pilih paket yang sesuai, atau diskusikan custom project Anda.
        </p>
        <div className="grid-3">
          {active.map(s => (
            <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {s.badge && <span className={`badge badge-${s.badgeColor}`}>{s.badge}</span>}
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</h3>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                {s.price === 0
                  ? <span className="green">Harga Negosiasi</span>
                  : <><span className="green">{fmtPrice(s.price)}</span>{s.priceMax && <span className="muted"> – {fmtPrice(s.priceMax)}</span>}</>
                }
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.description}</p>
              <div className="divider" style={{ margin: '4px 0' }} />
              <div>
                <p style={{ fontSize: 11, color: 'var(--terminal-green)', letterSpacing: '0.08em', marginBottom: 8 }}>// fitur_termasuk</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {s.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <span className="green">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8 }}>// deliverables</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.deliverables.map(d => (
                    <li key={d} style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>→</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={`/marketplace?service=${s.id}`} className="btn btn-primary btn-sm" style={{ marginTop: 'auto' }}>
                $ pesan sekarang
              </Link>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Tidak menemukan yang sesuai? Diskusikan custom project Anda.
          </p>
          <Link to="/marketplace" className="btn btn-green">Custom Order →</Link>
        </div>
      </div>
    </div>
  );
}

// PortfolioPage.jsx
export function PortfolioPage() {
  const { portfolio } = useApp();
  const [filter, setFilter] = React.useState('all');
  const categories = ['all', ...new Set(portfolio.map(p => p.category))];
  const filtered = filter === 'all' ? portfolio : portfolio.filter(p => p.category === filter);

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80 }}>
      <div className="container">
        <p className="green" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>// portfolio</p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, marginBottom: 8 }}>Karya Kami</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32 }}>
          Proyek-proyek yang telah kami selesaikan untuk klien.
        </p>
        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {categories.map(c => (
            <button key={c} className={`btn btn-sm ${filter === c ? 'btn-primary' : ''}`}
              onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            Belum ada portfolio di kategori ini.
          </div>
        )}
        <div className="grid-3">
          {filtered.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                width: '100%', height: 180,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {p.image
                  ? <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span className="green" style={{ fontSize: 32, fontWeight: 800 }}>{'<'}/{'>'}</span>
                }
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span className="badge">{p.category}</span>
                {p.featured && <span className="badge badge-amber">featured</span>}
                <span className="muted" style={{ fontSize: 10, marginLeft: 'auto' }}>{p.completedAt}</span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{p.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>{p.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.tech.map(t => <span key={t} className="badge">{t}</span>)}
              </div>
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-sm">
                  Live Demo →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
