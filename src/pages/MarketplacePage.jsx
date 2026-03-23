import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import toast from 'react-hot-toast';
import './MarketplacePage.css';

function fmtPrice(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

// Step indicator
function Steps({ current }) {
  const steps = ['Pilih Layanan', 'Detail Project', 'Konfirmasi'];
  return (
    <div className="mp-steps">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`mp-step ${i + 1 <= current ? 'active' : ''} ${i + 1 < current ? 'done' : ''}`}>
            <span className="mp-step-num">{i + 1 < current ? '✓' : String(i + 1).padStart(2, '0')}</span>
            <span className="mp-step-label">{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`mp-step-line ${i + 1 < current ? 'active' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function MarketplacePage() {
  const { services, createOrder, siteConfig } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerWA: '',
    projectTitle: '', projectDesc: '', projectRef: '',
    budget: '', deadline: '', notes: '',
  });
  const [createdOrder, setCreatedOrder] = useState(null);

  const activeServices = services.filter(s => s.active);

  useEffect(() => {
    const sid = searchParams.get('service');
    if (sid) {
      const s = services.find(s => s.id === sid);
      if (s) { setSelectedService(s); setStep(2); }
    }
  }, [searchParams, services]);

  const handleSelectService = (s) => {
    setSelectedService(s);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.projectDesc) {
      toast.error('Lengkapi data yang wajib diisi', { className: 'toast-terminal' });
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitOrder = () => {
    const order = createOrder({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerWA: form.customerWA,
      projectTitle: form.projectTitle || selectedService.name,
      projectDesc: form.projectDesc,
      projectRef: form.projectRef,
      budget: form.budget,
      deadline: form.deadline,
      notes: form.notes,
    });
    setCreatedOrder(order);
    setStep(4);
    toast.success('Pesanan berhasil dikirim!', { className: 'toast-terminal' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 4 = success
  if (step === 4 && createdOrder) {
    return (
      <div className="mp-page container">
        <div className="mp-success">
          <div className="terminal-window mp-success-terminal">
            <div className="terminal-header">
              <span className="terminal-dot red" /><span className="terminal-dot amber" /><span className="terminal-dot green" />
              <span className="terminal-title">order_confirmed.sh</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-prompt">submit --order</div>
              <div className="terminal-output green">✔ Order berhasil dibuat!</div>
              <div className="terminal-output" style={{ marginTop: 8 }}>
                Order ID: <span className="green">{createdOrder.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="terminal-output">Layanan: {createdOrder.serviceName}</div>
              <div className="terminal-output">Status: <span className="amber">● pending review</span></div>
              <div className="terminal-output" style={{ marginTop: 8 }}>
                Admin akan menghubungi Anda dalam &lt; 2 jam.
              </div>
            </div>
          </div>
          <div className="mp-success-info">
            <div className="mp-success-id">
              <span className="label">Order ID Anda</span>
              <span className="mp-success-id-value green">{createdOrder.id.slice(0, 8).toUpperCase()}</span>
              <button className="btn btn-xs" onClick={() => {
                navigator.clipboard.writeText(createdOrder.id.slice(0, 8).toUpperCase());
                toast.success('Disalin!', { className: 'toast-terminal' });
              }}>copy</button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Simpan Order ID Anda untuk tracking dan chat dengan admin. Cek email <strong>{form.customerEmail}</strong> untuk konfirmasi.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
              <button className="btn btn-primary" onClick={() => navigate(`/track?id=${createdOrder.id}`)}>
                Track Order
              </button>
              <a href={`https://wa.me/${siteConfig.whatsapp}?text=Halo, saya baru order. Order ID: ${createdOrder.id.slice(0,8).toUpperCase()}`}
                target="_blank" rel="noreferrer" className="btn btn-green">
                Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mp-page">
      <div className="mp-hero container">
        <p className="mp-hero-tag green">// marketplace</p>
        <h1 className="mp-hero-title">Order Layanan</h1>
        <p className="mp-hero-sub">Pilih paket, isi detail project, dan mulai berkolaborasi.</p>
      </div>
      <div className="container mp-body">
        <Steps current={step} />

        {/* ── STEP 1: Choose Service ── */}
        {step === 1 && (
          <div className="mp-step1">
            <div className="mp-grid">
              {activeServices.map(s => (
                <div
                  key={s.id}
                  className={`card mp-service-card ${selectedService?.id === s.id ? 'selected' : ''}`}
                  onClick={() => handleSelectService(s)}
                >
                  {s.badge && (
                    <span className={`badge badge-${s.badgeColor}`} style={{ marginBottom: 10 }}>{s.badge}</span>
                  )}
                  <h3 className="mp-service-name">{s.name}</h3>
                  <div className="mp-service-price">
                    {s.price === 0
                      ? <span className="green">Harga Negosiasi</span>
                      : <>
                          <span className="green">{fmtPrice(s.price)}</span>
                          {s.priceMax && <span className="muted"> – {fmtPrice(s.priceMax)}</span>}
                        </>
                    }
                  </div>
                  <p className="mp-service-desc">{s.description}</p>
                  <ul className="mp-service-feat">
                    {s.features.map(f => <li key={f}><span className="green">✓</span> {f}</li>)}
                  </ul>
                  <button className="btn btn-sm btn-primary" style={{ marginTop: 'auto' }}>
                    Pilih Paket →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Form ── */}
        {step === 2 && selectedService && (
          <div className="mp-step2">
            <div className="mp-selected-service">
              <span className="label">Layanan dipilih</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <strong>{selectedService.name}</strong>
                <span className="green">
                  {selectedService.price === 0 ? 'Harga Negosiasi' : fmtPrice(selectedService.price)}
                </span>
                <button className="btn btn-xs btn-danger" onClick={() => { setSelectedService(null); setStep(1); }}>
                  ganti
                </button>
              </div>
            </div>
            <form onSubmit={handleStep2Submit} className="mp-form">
              <div className="mp-form-section">
                <p className="mp-form-section-title green">// data_customer</p>
                <div className="mp-form-row">
                  <div className="mp-form-group">
                    <label className="label">Nama Lengkap *</label>
                    <input name="customerName" value={form.customerName} onChange={handleFormChange}
                      placeholder="Ahmad Fauzi" required />
                  </div>
                  <div className="mp-form-group">
                    <label className="label">Email *</label>
                    <input name="customerEmail" type="email" value={form.customerEmail} onChange={handleFormChange}
                      placeholder="email@domain.com" required />
                  </div>
                  <div className="mp-form-group">
                    <label className="label">WhatsApp</label>
                    <input name="customerWA" value={form.customerWA} onChange={handleFormChange}
                      placeholder="08xxxxxxxxxx" />
                  </div>
                </div>
              </div>
              <div className="mp-form-section">
                <p className="mp-form-section-title green">// detail_project</p>
                <div className="mp-form-row">
                  <div className="mp-form-group">
                    <label className="label">Nama Project</label>
                    <input name="projectTitle" value={form.projectTitle} onChange={handleFormChange}
                      placeholder="Website Toko Online Saya" />
                  </div>
                  <div className="mp-form-group">
                    <label className="label">Referensi / Inspirasi</label>
                    <input name="projectRef" value={form.projectRef} onChange={handleFormChange}
                      placeholder="Link website referensi (opsional)" />
                  </div>
                </div>
                <div className="mp-form-group full">
                  <label className="label">Deskripsi Project * <span className="muted">(jelaskan kebutuhan Anda)</span></label>
                  <textarea name="projectDesc" value={form.projectDesc} onChange={handleFormChange}
                    placeholder="Saya butuh landing page untuk toko online saya yang menjual produk X. Saya ingin ada section hero, produk unggulan, testimoni, dan form kontak..." 
                    rows={5} required />
                </div>
                <div className="mp-form-row">
                  <div className="mp-form-group">
                    <label className="label">Budget (jika ada)</label>
                    <input name="budget" value={form.budget} onChange={handleFormChange}
                      placeholder="Rp 200.000" />
                  </div>
                  <div className="mp-form-group">
                    <label className="label">Deadline Diinginkan</label>
                    <input name="deadline" type="date" value={form.deadline} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="mp-form-group full">
                  <label className="label">Catatan Tambahan</label>
                  <textarea name="notes" value={form.notes} onChange={handleFormChange}
                    placeholder="Catatan khusus, preferensi warna, font, dll..." rows={3} />
                </div>
              </div>
              <div className="mp-form-actions">
                <button type="button" className="btn" onClick={() => setStep(1)}>← Kembali</button>
                <button type="submit" className="btn btn-primary">Lanjut Review →</button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: Confirm ── */}
        {step === 3 && selectedService && (
          <div className="mp-step3">
            <div className="terminal-window mp-confirm-terminal">
              <div className="terminal-header">
                <span className="terminal-dot red" /><span className="terminal-dot amber" /><span className="terminal-dot green" />
                <span className="terminal-title">order_review.sh</span>
              </div>
              <div className="terminal-body">
                <div className="terminal-prompt">cat order.json</div>
                <pre className="terminal-output mp-confirm-json">{JSON.stringify({
                  layanan: selectedService.name,
                  harga: selectedService.price === 0 ? 'negosiasi' : fmtPrice(selectedService.price),
                  customer: form.customerName,
                  email: form.customerEmail,
                  project: form.projectTitle || selectedService.name,
                }, null, 2)}</pre>
              </div>
            </div>
            <div className="mp-confirm-details">
              <h3 className="mp-confirm-title">Review Pesanan</h3>
              <div className="mp-confirm-row"><span>Layanan</span><strong>{selectedService.name}</strong></div>
              <div className="mp-confirm-row"><span>Harga Estimasi</span><strong className="green">{selectedService.price === 0 ? 'Negosiasi' : fmtPrice(selectedService.price)}{selectedService.priceMax ? ` – ${fmtPrice(selectedService.priceMax)}` : ''}</strong></div>
              <div className="mp-confirm-row"><span>Nama</span><strong>{form.customerName}</strong></div>
              <div className="mp-confirm-row"><span>Email</span><strong>{form.customerEmail}</strong></div>
              {form.customerWA && <div className="mp-confirm-row"><span>WhatsApp</span><strong>{form.customerWA}</strong></div>}
              <div className="mp-confirm-row"><span>Project</span><strong>{form.projectTitle || selectedService.name}</strong></div>
              {form.deadline && <div className="mp-confirm-row"><span>Deadline</span><strong>{form.deadline}</strong></div>}
              <div className="mp-confirm-desc">
                <span>Deskripsi</span>
                <p>{form.projectDesc}</p>
              </div>
              <div className="mp-confirm-note">
                <span className="amber">⚠</span> Harga final akan dikonfirmasi admin setelah review brief Anda. Pembayaran dilakukan setelah kesepakatan.
              </div>
              <div className="mp-form-actions" style={{ marginTop: 24 }}>
                <button className="btn" onClick={() => setStep(2)}>← Edit</button>
                <button className="btn btn-primary" onClick={handleSubmitOrder}>
                  ✓ Kirim Pesanan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
