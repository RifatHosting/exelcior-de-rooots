import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); });

const AppContext = createContext(null);

// ── Default Data ──────────────────────────────────────────────
const DEFAULT_SITE_CONFIG = {
  siteName: 'DevScale',
  tagline: 'Professional Frontend Development Services',
  logo: null, // base64 or URL
  adminEmail: 'admin@devscale.id',
  whatsapp: '6281234567890',
  instagram: '@devscale.id',
  footerText: '© 2025 DevScale. All rights reserved.',
  heroTitle: 'Build. Scale. Ship.',
  heroSubtitle: 'Jasa pembuatan website frontend profesional. Mulai dari Rp 150.000.',
  accentColor: '#00ff41',
};

const DEFAULT_SERVICES = [
  {
    id: 's1',
    name: 'Landing Page Basic',
    slug: 'landing-page-basic',
    price: 150000,
    priceMax: null,
    category: 'landing-page',
    badge: 'POPULER',
    badgeColor: 'green',
    description: 'Landing page statis satu halaman. Cocok untuk profil bisnis, promo produk, atau personal branding.',
    features: ['1 halaman responsif', 'HTML/CSS/JS murni', 'Mobile friendly', 'Revisi 2x', 'Delivery 3-5 hari'],
    deliverables: ['Source code (.zip)', 'File HTML deploy-ready', 'Panduan upload'],
    active: true,
    order: 1,
  },
  {
    id: 's2',
    name: 'Landing Page Pro',
    slug: 'landing-page-pro',
    price: 250000,
    priceMax: 350000,
    category: 'landing-page',
    badge: 'BEST VALUE',
    badgeColor: 'amber',
    description: 'Landing page premium dengan animasi, form kontak, integrasi WhatsApp, dan desain custom sesuai brief.',
    features: ['Hingga 3 section custom', 'Animasi modern', 'Form + WA integration', 'Mobile & desktop polished', 'Revisi 3x', 'Delivery 5-7 hari'],
    deliverables: ['Source code (.zip)', 'Deploy ke hosting pilihan Anda', 'Dokumentasi'],
    active: true,
    order: 2,
  },
  {
    id: 's3',
    name: 'Multi-Page Website',
    slug: 'multi-page',
    price: 350000,
    priceMax: null,
    category: 'website',
    badge: 'KOMPLEKS',
    badgeColor: '',
    description: 'Website multi-halaman (Home, About, Portfolio, Contact, dll). Cocok untuk UMKM, agensi, atau startup.',
    features: ['3-6 halaman penuh', 'Navigasi & routing', 'Form & kontak', 'SEO dasar', 'Revisi 5x', 'Delivery 7-14 hari'],
    deliverables: ['Full source code', 'Deploy assistance', 'Laporan SEO dasar'],
    active: true,
    order: 3,
  },
  {
    id: 's4',
    name: 'React / Next.js App',
    slug: 'react-nextjs',
    price: 500000,
    priceMax: null,
    category: 'app',
    badge: 'PREMIUM',
    badgeColor: 'cyan',
    description: 'Aplikasi web modern berbasis React atau Next.js. Dashboard, SaaS, atau aplikasi interaktif sesuai kebutuhan.',
    features: ['React/Next.js', 'State management', 'API integration', 'Auth dasar opsional', 'Revisi unlimited*', 'Delivery sesuai scope'],
    deliverables: ['Full source code + repo', 'Deploy Vercel/hosting', 'Dokumentasi teknis'],
    active: true,
    order: 4,
  },
  {
    id: 's5',
    name: 'Microsite / Event Page',
    slug: 'microsite',
    price: 100000,
    priceMax: 200000,
    category: 'landing-page',
    badge: 'MINI',
    badgeColor: '',
    description: 'Halaman event, undangan digital, atau microsite promosi. Cepat, ringkas, dan efektif.',
    features: ['1 halaman tematis', 'Countdown timer opsional', 'Share-ready', 'Revisi 2x', 'Delivery 1-3 hari'],
    deliverables: ['File HTML siap pakai', 'Link preview'],
    active: true,
    order: 5,
  },
  {
    id: 's6',
    name: 'Custom / Negosiasi',
    slug: 'custom',
    price: 0,
    priceMax: null,
    category: 'custom',
    badge: 'FLEKSIBEL',
    badgeColor: '',
    description: 'Proyek di luar kategori di atas? Diskusikan kebutuhan Anda. Harga dan timeline disepakati bersama.',
    features: ['Scope sesuai kebutuhan', 'Teknologi fleksibel', 'Harga negosiasi', 'Timeline disepakati', 'Revisi disepakati'],
    deliverables: ['Sesuai perjanjian'],
    active: true,
    order: 6,
  },
];

const DEFAULT_PORTFOLIO = [
  {
    id: 'p1',
    title: 'Warung Kopi Nusantara',
    category: 'landing-page',
    description: 'Landing page untuk brand kopi lokal dengan animasi parallax dan menu interaktif.',
    tech: ['HTML', 'CSS', 'Vanilla JS'],
    image: null,
    liveUrl: '',
    completedAt: '2025-01-15',
    featured: true,
  },
  {
    id: 'p2',
    title: 'Startup SaaS Dashboard',
    category: 'app',
    description: 'Dashboard admin untuk startup fintech, lengkap dengan chart dan manajemen data.',
    tech: ['React', 'Tailwind', 'Chart.js'],
    image: null,
    liveUrl: '',
    completedAt: '2025-02-20',
    featured: true,
  },
  {
    id: 'p3',
    title: 'Undangan Digital Wedding',
    category: 'microsite',
    description: 'Undangan pernikahan digital interaktif dengan animasi bunga, countdown, dan RSVP.',
    tech: ['HTML', 'CSS', 'JS'],
    image: null,
    liveUrl: '',
    completedAt: '2025-03-05',
    featured: false,
  },
];

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'devscale2025',
};

// ── Helper: localStorage ──────────────────────────────────────
function ls(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch { return def; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── Provider ──────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [siteConfig, setSiteConfigRaw] = useState(() => ls('ds_config', DEFAULT_SITE_CONFIG));
  const [services, setServicesRaw] = useState(() => ls('ds_services', DEFAULT_SERVICES));
  const [portfolio, setPortfolioRaw] = useState(() => ls('ds_portfolio', DEFAULT_PORTFOLIO));
  const [orders, setOrdersRaw] = useState(() => ls('ds_orders', []));
  const [messages, setMessagesRaw] = useState(() => ls('ds_messages', {})); // { orderId: [{...}] }
  const [adminSession, setAdminSession] = useState(() => ls('ds_admin_session', false));
  const [notifications, setNotificationsRaw] = useState(() => ls('ds_notifications', []));

  // Persist helpers
  const setSiteConfig = useCallback((v) => { setSiteConfigRaw(v); lsSet('ds_config', v); }, []);
  const setServices = useCallback((v) => { setServicesRaw(v); lsSet('ds_services', v); }, []);
  const setPortfolio = useCallback((v) => { setPortfolioRaw(v); lsSet('ds_portfolio', v); }, []);
  const setOrders = useCallback((v) => { setOrdersRaw(v); lsSet('ds_orders', v); }, []);
  const setMessages = useCallback((v) => { setMessagesRaw(v); lsSet('ds_messages', v); }, []);
  const setNotifications = useCallback((v) => { setNotificationsRaw(v); lsSet('ds_notifications', v); }, []);

  // ── Admin Auth ──
  const adminLogin = useCallback((username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setAdminSession(true);
      lsSet('ds_admin_session', true);
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setAdminSession(false);
    lsSet('ds_admin_session', false);
  }, []);

  // ── Orders ──
  const createOrder = useCallback((orderData) => {
    const order = {
      id: uuidv4(),
      ...orderData,
      status: 'pending', // pending | in_progress | completed | cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminUnread: true,
      customerUnread: false,
      resultFile: null,
    };
    setOrders(prev => {
      const next = [order, ...prev];
      lsSet('ds_orders', next);
      return next;
    });
    // init message thread
    setMessages(prev => {
      const next = { ...prev, [order.id]: [] };
      lsSet('ds_messages', next);
      return next;
    });
    addNotification(`Pesanan baru: ${order.serviceName} dari ${order.customerName}`, 'order');
    return order;
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
      lsSet('ds_orders', next);
      return next;
    });
  }, []);

  const updateOrder = useCallback((orderId, fields) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, ...fields, updatedAt: new Date().toISOString() } : o);
      lsSet('ds_orders', next);
      return next;
    });
  }, []);

  // ── Messages ──
  const sendMessage = useCallback((orderId, text, sender, file = null) => {
    const msg = {
      id: uuidv4(),
      orderId,
      text,
      sender, // 'admin' | 'customer'
      file,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => {
      const thread = prev[orderId] || [];
      const next = { ...prev, [orderId]: [...thread, msg] };
      lsSet('ds_messages', next);
      return next;
    });
    // mark unread on the other side
    setOrders(prev => {
      const next = prev.map(o => {
        if (o.id !== orderId) return o;
        return sender === 'admin'
          ? { ...o, customerUnread: true }
          : { ...o, adminUnread: true };
      });
      lsSet('ds_orders', next);
      return next;
    });
    if (sender === 'customer') {
      addNotification(`Pesan baru dari customer`, 'message');
    }
    return msg;
  }, []);

  const markThreadRead = useCallback((orderId, role) => {
    setOrders(prev => {
      const next = prev.map(o => {
        if (o.id !== orderId) return o;
        return role === 'admin'
          ? { ...o, adminUnread: false }
          : { ...o, customerUnread: false };
      });
      lsSet('ds_orders', next);
      return next;
    });
  }, []);

  // ── Portfolio ──
  const addPortfolio = useCallback((item) => {
    const newItem = { id: uuidv4(), ...item, createdAt: new Date().toISOString() };
    setPortfolio(prev => {
      const next = [newItem, ...prev];
      lsSet('ds_portfolio', next);
      return next;
    });
    return newItem;
  }, []);

  const updatePortfolio = useCallback((id, fields) => {
    setPortfolio(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...fields } : p);
      lsSet('ds_portfolio', next);
      return next;
    });
  }, []);

  const deletePortfolio = useCallback((id) => {
    setPortfolio(prev => {
      const next = prev.filter(p => p.id !== id);
      lsSet('ds_portfolio', next);
      return next;
    });
  }, []);

  // ── Services ──
  const addService = useCallback((item) => {
    const newItem = { id: uuidv4(), ...item };
    setServices(prev => {
      const next = [...prev, newItem];
      lsSet('ds_services', next);
      return next;
    });
    return newItem;
  }, []);

  const updateService = useCallback((id, fields) => {
    setServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...fields } : s);
      lsSet('ds_services', next);
      return next;
    });
  }, []);

  const deleteService = useCallback((id) => {
    setServices(prev => {
      const next = prev.filter(s => s.id !== id);
      lsSet('ds_services', next);
      return next;
    });
  }, []);

  // ── Notifications ──
  const addNotification = useCallback((text, type = 'info') => {
    const n = { id: uuidv4(), text, type, read: false, createdAt: new Date().toISOString() };
    setNotifications(prev => {
      const next = [n, ...prev].slice(0, 50);
      lsSet('ds_notifications', next);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      lsSet('ds_notifications', next);
      return next;
    });
  }, []);

  // ── Upload result file ──
  const uploadResultFile = useCallback((orderId, fileData) => {
    // fileData: { name, size, type, data (base64) }
    updateOrder(orderId, { resultFile: fileData });
    addNotification(`File hasil diunggah untuk pesanan`, 'file');
  }, [updateOrder]);

  const value = {
    siteConfig, setSiteConfig,
    services, addService, updateService, deleteService,
    portfolio, addPortfolio, updatePortfolio, deletePortfolio,
    orders, createOrder, updateOrderStatus, updateOrder,
    messages, sendMessage, markThreadRead,
    adminSession, adminLogin, adminLogout,
    notifications, addNotification, markAllNotificationsRead,
    uploadResultFile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
