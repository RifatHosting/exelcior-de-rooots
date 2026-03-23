# DevScale — Frontend Web Services

> Terminal-themed marketplace & admin dashboard untuk jasa pembuatan website frontend.

---

## 🚀 Quick Start

```bash
npm install
npm start
```

---

## 📁 Struktur Proyek

```
devscale/
├── public/
│   └── index.html
├── src/
│   ├── context/
│   │   └── AppContext.jsx      # Global state (localStorage)
│   ├── components/
│   │   ├── Navbar.jsx / .css
│   │   └── Footer.jsx / .css
│   ├── pages/
│   │   ├── HomePage.jsx / .css
│   │   ├── MarketplacePage.jsx / .css
│   │   ├── TrackPage.jsx / .css
│   │   └── PublicPages.jsx     # Services + Portfolio pages
│   ├── admin/
│   │   ├── AdminLogin.jsx / .css
│   │   ├── AdminLayout.jsx
│   │   ├── AdminPage.jsx       # Tab router
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminChat.jsx
│   │   ├── AdminServices.jsx
│   │   ├── AdminPortfolio.jsx
│   │   └── AdminSettings.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages auto-deploy
├── vercel.json                 # Vercel config
└── package.json
```

---

## 🔐 Login Admin

- **URL:** `/admin`
- **Username:** `admin`
- **Password:** `devscale2025`

> ⚠️ Ganti password di `src/context/AppContext.jsx` baris `ADMIN_CREDENTIALS` sebelum deploy!

---

## 🌐 Deploy ke GitHub Pages

### Setup awal:
1. Push repo ke GitHub
2. Di repo settings → **Pages** → Source: **GitHub Actions**
3. Push ke branch `main` — workflow akan otomatis build & deploy

### Catatan routing:
Karena GitHub Pages adalah static hosting, React Router butuh `homepage` di `package.json`:
```json
"homepage": "https://USERNAME.github.io/REPO_NAME"
```
Ganti `USERNAME` dan `REPO_NAME` sesuai repo Anda.

---

## ▲ Deploy ke Vercel

### Cara 1 — Via Vercel Dashboard:
1. Login ke [vercel.com](https://vercel.com)
2. **New Project** → Import repo GitHub Anda
3. Framework: **Create React App**
4. Build command: `npm run build`
5. Output dir: `build`
6. **Deploy!**

### Cara 2 — Via CLI:
```bash
npm i -g vercel
vercel --prod
```

---

## ✨ Fitur Lengkap

### 🏠 Public Website
- **Homepage** — Hero dengan typewriter effect, stats, layanan preview, cara kerja, portfolio, FAQ, CTA
- **Services** — Semua layanan dengan detail fitur & harga
- **Portfolio** — Karya dengan filter kategori
- **Marketplace** — 3-step order flow (pilih → form → konfirmasi)
- **Track Order** — Cek status + real-time chat dengan admin

### 🔧 Admin Dashboard (`/admin`)
- **Dashboard** — Overview stats, activity log, recent orders
- **Orders** — Manajemen order lengkap, update status, detail customer
- **Chat** — Inbox semua percakapan customer, kirim file
- **Services** — CRUD layanan (tambah/edit/hapus/aktifkan)
- **Portfolio** — CRUD portfolio (upload gambar, featured toggle)
- **Settings** — Upload logo, ubah nama/tagline/hero/footer/kontak

### 💾 Data Storage
Semua data disimpan di `localStorage` — tidak butuh backend/database.
Data persisten selama browser tidak di-clear.

---

## 🎨 Design
- Black & White terminal/Termux aesthetic
- Font: JetBrains Mono
- Scan line overlay untuk efek terminal
- Glitch animation pada hero title
- Typewriter effect
- Responsive mobile

---

## ⚙️ Kustomisasi

### Ganti password admin:
```js
// src/context/AppContext.jsx
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'PASSWORD_BARU_ANDA',
};
```

### Reset semua data:
Buka browser console:
```js
localStorage.clear(); location.reload();
```

### Tambah layanan baru:
Login admin → **Services** → **+ Tambah Layanan**

---

## 📦 Dependencies

- `react`, `react-dom` — UI framework
- `react-router-dom` — Routing
- `react-hot-toast` — Toast notifications
- `uuid` — ID generation
