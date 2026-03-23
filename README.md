# DevScale — Frontend Web Services

> Terminal-themed marketplace & admin dashboard — Vite + React

---

## 🚀 Quick Start (Local)

```bash
npm install
npm run dev
```

Buka: http://localhost:5173

---

## ▲ Deploy ke Vercel (CARA TERMUDAH)

### Opsi 1 — Vercel Dashboard (Rekomendasi):
1. Login [vercel.com](https://vercel.com) → **New Project**
2. Import repo GitHub ini
3. Vercel otomatis detect **Vite** → langsung klik **Deploy**
4. Selesai ✓ (tidak perlu setting apapun)

### Opsi 2 — Vercel CLI:
```bash
npm i -g vercel
vercel --prod
```

---

## 🌐 Deploy ke GitHub Pages

1. Push ke GitHub
2. Repo Settings → **Pages** → Source: **GitHub Actions**
3. Push ke branch `main` → otomatis deploy

> **Catatan GitHub Pages:** Tambahkan `base: '/NAMA_REPO/'` di `vite.config.js` jika URL-nya `username.github.io/NAMA_REPO`

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/devscale/',   // ← ganti dengan nama repo kamu
})
```

---

## 🔐 Login Admin

- URL: `/admin`
- Username: `admin`
- Password: `devscale2025`

> **Ganti password** di `src/context/AppContext.jsx`:
> ```js
> const ADMIN_CREDENTIALS = { username: 'admin', password: 'PASSWORD_BARU' };
> ```

---

## 📁 Struktur

```
devscale/
├── index.html              ← entry point Vite
├── vite.config.js
├── vercel.json             ← SPA routing fix
├── package.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/AppContext.jsx   ← global state (localStorage)
    ├── components/              ← Navbar, Footer
    ├── pages/                   ← Home, Services, Portfolio, Marketplace, Track
    └── admin/                   ← Login, Dashboard, Orders, Chat, Services, Portfolio, Settings
```

---

## ✨ Fitur

| Halaman | Keterangan |
|---|---|
| Homepage | Hero typewriter, stats, layanan, cara kerja, portfolio, FAQ |
| Marketplace | 3-step order: pilih → form → konfirmasi |
| Track Order | Cek status + chat 2 arah + download file hasil |
| Admin Dashboard | Stats, activity log, recent orders |
| Admin Orders | Manajemen order, update status, detail customer |
| Admin Chat | Inbox semua customer, kirim pesan & file |
| Admin Services | CRUD layanan lengkap |
| Admin Portfolio | CRUD + upload thumbnail + featured toggle |
| Admin Settings | Upload logo, ubah nama/tagline/kontak |

---

## 💾 Data Storage

Semua data disimpan di `localStorage` browser — tidak butuh backend.

Reset data:
```js
localStorage.clear(); location.reload();
```
