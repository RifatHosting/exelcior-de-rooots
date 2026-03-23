import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './HomePage.css';

// Animated counter
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(start);
          if (start >= target) clearInterval(timer);
        }, 30);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// Typewriter
function Typewriter({ strings, speed = 80 }) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) {
      const t = setTimeout(() => { setPause(false); setDeleting(true); }, 2000);
      return () => clearTimeout(t);
    }
    const current = strings[idx % strings.length];
    if (!deleting) {
      if (charIdx < current.length) {
        const t = setTimeout(() => {
          setDisplay(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, speed);
        return () => clearTimeout(t);
      } else { setPause(true); }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setDisplay(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        }, speed / 2);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIdx(i => i + 1);
      }
    }
  }, [charIdx, deleting, idx, pause, speed, strings]);

  return <span>{display}<span className="blink green">█</span></span>;
}

// Format price
function fmtPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function HomePage() {
  const { siteConfig, services, portfolio } = useApp();
  const featuredPortfolio = portfolio.filter(p => p.featured).slice(0, 3);
  const activeServices = services.filter(s => s.active).slice(0, 3);

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="home__hero">
        <div className="home__hero-bg">
          <div className="home__grid-overlay" />
        </div>
        <div className="container home__hero-content">
          <div className="home__hero-badge fade-in">
            <span className="status-dot" />
            <span>OPEN FOR ORDERS — RESPONSE &lt; 2 JAM</span>
          </div>
          <h1 className="home__hero-title fade-in glitch" data-text={siteConfig.heroTitle}>
            {siteConfig.heroTitle}
          </h1>
          <p className="home__hero-subtitle fade-in">
            <Typewriter strings={[
              'Landing Page dari Rp 150.000',
              'React App yang production-ready',
              'Frontend cepat, rapi, bisa deploy',
              'Desain custom sesuai brief Anda',
              'Deadline ditepati, revisi friendly',
            ]} />
          </p>
          <p className="home__hero-desc fade-in">{siteConfig.heroSubtitle}</p>
          <div className="home__hero-actions fade-in">
            <Link to="/marketplace" className="btn btn-primary">
              <span>$ order sekarang</span>
            </Link>
            <Link to="/services" className="btn">
              <span>lihat layanan →</span>
            </Link>
          </div>
        </div>
        {/* Terminal window decoration */}
        <div className="container home__hero-terminal fade-in">
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot red" />
              <span className="terminal-dot amber" />
              <span className="terminal-dot green" />
              <span className="terminal-title">devscale — frontend services</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-prompt">npm run quote --project landing-page</div>
              <div className="terminal-output">✔ Estimasi harga: Rp 150.000 – Rp 350.000</div>
              <div className="terminal-output">✔ Timeline: 3-7 hari kerja</div>
              <div className="terminal-output">✔ Revisi: 2-5x termasuk</div>
              <div className="terminal-prompt" style={{ marginTop: 8 }}>git status</div>
              <div className="terminal-output green">● 3 proyek aktif berjalan</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section-sm home__stats">
        <div className="container">
          <div className="home__stats-grid">
            {[
              { label: 'Proyek Selesai', value: 42, suffix: '+' },
              { label: 'Klien Happy', value: 38, suffix: '+' },
              { label: 'Revisi Rata-rata', value: 2, suffix: 'x' },
              { label: 'Response Time', value: 2, suffix: 'h' },
            ].map(({ label, value, suffix }) => (
              <div key={label} className="home__stat">
                <div className="home__stat-value green">
                  <Counter target={value} suffix={suffix} />
                </div>
                <div className="home__stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="section container">
        <div className="home__section-header">
          <p className="home__section-tag green">// services</p>
          <h2 className="home__section-title">Layanan Unggulan</h2>
          <p className="home__section-desc">Pilih paket yang sesuai kebutuhan, atau diskusikan custom project Anda.</p>
        </div>
        <div className="grid-3" style={{ marginTop: 40 }}>
          {activeServices.map(s => (
            <div key={s.id} className="card home__service-card">
              {s.badge && (
                <span className={`badge badge-${s.badgeColor || ''}`} style={{ marginBottom: 12 }}>
                  {s.badge}
                </span>
              )}
              <h3 className="home__service-name">{s.name}</h3>
              <div className="home__service-price">
                {s.price === 0
                  ? <span className="green">Harga Negosiasi</span>
                  : <>
                      <span className="green">{fmtPrice(s.price)}</span>
                      {s.priceMax && <span className="muted"> – {fmtPrice(s.priceMax)}</span>}
                    </>
                }
              </div>
              <p className="home__service-desc">{s.description}</p>
              <ul className="home__service-features">
                {s.features.slice(0, 4).map(f => (
                  <li key={f}><span className="green">✓</span> {f}</li>
                ))}
              </ul>
              <Link to={`/marketplace?service=${s.id}`} className="btn btn-sm" style={{ marginTop: 'auto' }}>
                $ pesan ini
              </Link>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/services" className="btn">Lihat Semua Layanan →</Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section home__how">
        <div className="container">
          <div className="home__section-header">
            <p className="home__section-tag green">// how_it_works</p>
            <h2 className="home__section-title">Cara Kerja</h2>
          </div>
          <div className="home__steps">
            {[
              { n: '01', title: 'Pilih & Order', desc: 'Pilih layanan, isi form pemesanan dengan detail project Anda, dan lakukan pembayaran.', icon: '→' },
              { n: '02', title: 'Brief & Diskusi', desc: 'Admin akan menghubungi Anda untuk diskusi detail, referensi, dan timeline project.', icon: '⇄' },
              { n: '03', title: 'Pengerjaan', desc: 'Kami mengerjakan project Anda. Anda bisa cek progress dan chat langsung di dashboard.', icon: '◈' },
              { n: '04', title: 'Revisi & Delivery', desc: 'Anda mereview hasil, request revisi jika perlu, lalu file final dikirim lewat dashboard.', icon: '✓' },
            ].map(({ n, title, desc, icon }) => (
              <div key={n} className="home__step">
                <div className="home__step-num green">{n}</div>
                <div className="home__step-icon">{icon}</div>
                <h4 className="home__step-title">{title}</h4>
                <p className="home__step-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO PREVIEW ── */}
      {featuredPortfolio.length > 0 && (
        <section className="section container">
          <div className="home__section-header">
            <p className="home__section-tag green">// portfolio</p>
            <h2 className="home__section-title">Karya Terbaru</h2>
          </div>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {featuredPortfolio.map(p => (
              <div key={p.id} className="card home__portfolio-card">
                <div className="home__portfolio-img">
                  {p.image
                    ? <img src={p.image} alt={p.title} />
                    : <div className="home__portfolio-placeholder">
                        <span className="green">{'<'}/{'>'}</span>
                      </div>
                  }
                </div>
                <div className="home__portfolio-meta">
                  <span className="badge">{p.category}</span>
                  <span className="muted" style={{ fontSize: 10 }}>{p.completedAt}</span>
                </div>
                <h4 className="home__portfolio-title">{p.title}</h4>
                <p className="home__portfolio-desc">{p.description}</p>
                <div className="home__portfolio-tech">
                  {p.tech.map(t => <span key={t} className="badge">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/portfolio" className="btn">Lihat Semua Portfolio →</Link>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="section home__faq">
        <div className="container">
          <div className="home__section-header">
            <p className="home__section-tag green">// faq</p>
            <h2 className="home__section-title">Pertanyaan Umum</h2>
          </div>
          <div className="home__faq-grid" style={{ marginTop: 40 }}>
            {[
              { q: 'Apakah harga bisa lebih murah?', a: 'Ya! Harga yang tertera adalah estimasi. Untuk project sederhana atau budget terbatas, hubungi kami untuk negosiasi harga.' },
              { q: 'Apakah termasuk hosting?', a: 'Tidak termasuk. Kami deliver source code + membantu deploy ke hosting atau platform pilihan Anda (GitHub Pages, Vercel, Netlify, dll).' },
              { q: 'Berapa lama proses pengerjaan?', a: 'Tergantung kompleksitas. Landing page basic 3-5 hari, multi-page 7-14 hari, React app sesuai scope yang disepakati.' },
              { q: 'Bagaimana cara revisi?', a: 'Revisi dilakukan melalui chat di dashboard order Anda. Jumlah revisi sesuai paket yang dipilih.' },
              { q: 'Teknologi apa yang digunakan?', a: 'HTML/CSS/JS vanilla, React, Next.js, Tailwind CSS, dan lainnya sesuai kebutuhan project Anda.' },
              { q: 'Bagaimana saya tahu status project?', a: 'Setelah order, Anda mendapat Order ID untuk track status real-time dan chat langsung dengan admin.' },
            ].map(({ q, a }) => (
              <div key={q} className="home__faq-item">
                <h4 className="home__faq-q"><span className="green">Q:</span> {q}</h4>
                <p className="home__faq-a"><span className="muted">A:</span> {a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="section container">
        <div className="home__cta">
          <div className="home__cta-inner">
            <p className="home__section-tag green" style={{ marginBottom: 12 }}>// get_started</p>
            <h2 className="home__cta-title">Siap Bangun Website Anda?</h2>
            <p className="home__cta-desc">Mulai dari Rp 150.000. Konsultasi gratis, revisi friendly, hasil memuaskan.</p>
            <div className="home__cta-actions">
              <Link to="/marketplace" className="btn btn-primary">$ order sekarang</Link>
              <a href={`https://wa.me/${siteConfig.whatsapp}?text=Halo,%20saya%20ingin%20konsultasi%20project`} target="_blank" rel="noreferrer" className="btn btn-green">
                Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
