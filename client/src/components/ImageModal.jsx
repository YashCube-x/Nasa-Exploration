import { useEffect, useRef } from 'react';

export default function ImageModal({ image, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    // Focus the close button on open
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
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Full view: ${image.title}`}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          className="modal-close"
          onClick={onClose}
          aria-label="Close image viewer"
        >
          ✕
        </button>
        <img src={image.src} alt={image.alt} />
        <div className="modal-caption">
          <strong>{image.title}</strong> — {image.description}
        </div>
      </div>
    </div>
  );
}
