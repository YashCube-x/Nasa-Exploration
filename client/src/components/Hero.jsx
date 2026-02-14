import { useEffect, useRef } from 'react';
import Starfield from './Starfield';

export default function Hero({ onSubscribeClick }) {
  const heroRef = useRef(null);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const content = heroRef.current.querySelector('.hero-content');
        if (content) {
          content.style.transform = `translateY(${scrollY * 0.25}px)`;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero" ref={heroRef}>
      <Starfield />

      <div className="hero-content">
        <div className="glass-card">
          <h1>Join the Orbit — Weekly Space Photos Delivered to Your Inbox</h1>
          <p>
            Stunning images from telescopes, probes and space agencies — curated
            for explorers. Discover the cosmos, one breathtaking photo at a time.
          </p>
          <button
            className="btn-cta"
            onClick={onSubscribeClick}
            aria-label="Subscribe to get weekly space photos"
          >
            🔭 Get Weekly Space Photos
          </button>
        </div>
      </div>
    </div>
  );
}
