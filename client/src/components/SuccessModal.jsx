import { useEffect, useRef } from 'react';

export default function SuccessModal({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="success-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="Subscription successful">
      <div className="glass-card success-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="rocket-emoji" aria-hidden="true">🚀</div>
        <h2>Welcome Aboard, Explorer!</h2>
        <p>
          Thanks — check your inbox for a welcome photo!
          You'll receive stunning space images delivered weekly.
        </p>
        <button
          ref={closeRef}
          className="btn-cta"
          onClick={onClose}
        >
          ✨ Awesome!
        </button>
      </div>
    </div>
  );
}
