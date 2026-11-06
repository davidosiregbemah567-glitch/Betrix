function SuccessModal({ title, message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card success-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✓</div>
        <h3>{title}</h3>
        <p className="success-message">{message}</p>
        <button className="modal-confirm-deposit" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;