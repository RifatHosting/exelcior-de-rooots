import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import { ServicesPage, PortfolioPage } from './pages/PublicPages.jsx'
import MarketplacePage from './pages/MarketplacePage.jsx'
import TrackPage from './pages/TrackPage.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminPage from './admin/AdminPage.jsx'
import './index.css'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{ className: 'toast-terminal', duration: 3000 }}
        />
        <Routes>
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
          <Route path="/marketplace" element={<PublicLayout><MarketplacePage /></PublicLayout>} />
          <Route path="/track" element={<PublicLayout><TrackPage /></PublicLayout>} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
