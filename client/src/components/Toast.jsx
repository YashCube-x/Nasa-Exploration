export default function Toast({ message, type = 'success', onClose }) {
  return (
    <div className={`toast ${type}`} role="alert" aria-live="polite">
      <span>{message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
