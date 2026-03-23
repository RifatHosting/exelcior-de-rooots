import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Footer.css';

export default function Footer() {
  const { siteConfig } = useApp();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="green">&gt;</span> {siteConfig.siteName}<span className="blink green">_</span>
            </div>
            <p className="footer__tagline">{siteConfig.tagline}</p>
            <div className="footer__status">
              <span className="status-dot" />
              <span className="muted" style={{ fontSize: 11 }}>Open for orders</span>
            </div>
          </div>
          <div className="footer__col">
            <p className="footer__heading">// navigation</p>
            <Link to="/" className="footer__link">Home</Link>
            <Link to="/services" className="footer__link">Services</Link>
            <Link to="/portfolio" className="footer__link">Portfolio</Link>
            <Link to="/marketplace" className="footer__link">Marketplace</Link>
            <Link to="/track" className="footer__link">Track Order</Link>
          </div>
          <div className="footer__col">
            <p className="footer__heading">// contact</p>
            {siteConfig.whatsapp && (
              <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer" className="footer__link">
                WhatsApp
              </a>
            )}
            {siteConfig.instagram && (
              <span className="footer__link">{siteConfig.instagram}</span>
            )}
            <span className="footer__link">{siteConfig.adminEmail}</span>
          </div>
          <div className="footer__col">
            <p className="footer__heading">// terminal</p>
            <div className="terminal-window footer__terminal">
              <div className="terminal-body" style={{ fontSize: 12, padding: 12 }}>
                <div className="terminal-prompt">whoami</div>
                <div className="terminal-output">frontend_dev</div>
                <div className="terminal-prompt" style={{ marginTop: 4 }}>status</div>
                <div className="terminal-output green">● online</div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="muted" style={{ fontSize: 11 }}>{siteConfig.footerText}</span>
          <Link to="/admin" className="footer__admin-link">admin</Link>
        </div>
      </div>
    </footer>
  );
}
