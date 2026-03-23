import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { ServicesPage, PortfolioPage } from './pages/PublicPages';
import MarketplacePage from './pages/MarketplacePage';
import TrackPage from './pages/TrackPage';
import AdminLogin from './admin/AdminLogin';
import AdminPage from './admin/AdminPage';
import './index.css';
import './pages/HomePage.css';

// Layout wrapper for public pages
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'toast-terminal',
            duration: 3000,
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
          <Route path="/marketplace" element={<PublicLayout><MarketplacePage /></PublicLayout>} />
          <Route path="/track" element={<PublicLayout><TrackPage /></PublicLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
