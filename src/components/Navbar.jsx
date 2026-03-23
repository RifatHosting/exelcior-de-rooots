import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { siteConfig } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: '/', label: '~/' },
    { to: '/services', label: 'services' },
    { to: '/portfolio', label: 'portfolio' },
    { to: '/marketplace', label: 'order' },
    { to: '/track', label: 'track' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          {siteConfig.logo
            ? <img src={siteConfig.logo} alt={siteConfig.siteName} className="navbar__logo-img" />
            : <span className="navbar__logo-text">
                <span className="green">&gt;</span> {siteConfig.siteName}<span className="blink green">_</span>
              </span>
          }
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className={`navbar__link ${location.pathname === to ? 'navbar__link--active' : ''}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="navbar__actions">
          <Link to="/marketplace" className="btn btn-primary btn-sm">
            <span>$ order</span>
          </Link>
          <button
            className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="navbar__mobile-link">
              <span className="green">$</span> {label}
            </Link>
          ))}
          <Link to="/marketplace" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
            $ order sekarang
          </Link>
        </div>
      )}
    </nav>
  );
}
