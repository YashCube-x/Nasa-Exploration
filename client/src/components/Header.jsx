import { useState } from 'react';

export default function Header({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (e, section) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate(section);
  };

  return (
    <header className="header" role="banner">
      <a href="#home" className="header-logo" onClick={(e) => handleNav(e, 'home')} aria-label="CosmicMail home">
        <span className="rocket" aria-hidden="true">🚀</span>
        <span>CosmicMail</span>
      </a>

      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        className={`header-nav ${menuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <a href="#home" onClick={(e) => handleNav(e, 'home')}>Home</a>
        <a href="#gallery" onClick={(e) => handleNav(e, 'gallery')}>Gallery</a>
        <a href="#subscribe" onClick={(e) => handleNav(e, 'subscribe')}>Subscribe</a>
      </nav>

      {/* Click-outside overlay for mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: -1,
            background: 'rgba(0,0,0,0.4)',
          }}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
