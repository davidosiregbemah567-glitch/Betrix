import { useState } from "react";

function BetModal({ match, selection, odd, onClose, onConfirm, currentBalance }) {
  const [stake, setStake] = useState("");
  const [error, setError] = useState("");

  const potentialWin = stake ? (Number(stake) * Number(odd)).toFixed(2) : "0.00";

  const handleConfirm = () => {
    const value = Number(stake);

    if (!value || value <= 0) {
      setError("Please enter a valid stake");
      return;
    }

    if (value > currentBalance) {
      setError("Insufficient balance");
      return;
    }

    onConfirm({
      match: `${match.home} vs ${match.away}`,
      selection,
      odd,
      stake: value,
      potentialWin: Number(potentialWin),
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>Place Bet</h3>
        <p className="modal-balance">
          {match.home} vs {match.away}
        </p>
        <p className="bet-selection">
          Selection: <strong>{selection}</strong> @ {odd}
        </p>

        <div className="form-group">
          <label>Stake (₦)</label>
          <input
            type="number"
            placeholder="Enter stake amount"
            value={stake}
            onChange={(e) => {
              setStake(e.target.value);
              setError("");
            }}
            autoFocus
          />
        </div>

        <div className="potential-win">
          Potential Win: <strong>₦{Number(potentialWin).toLocaleString()}</strong>
        </div>

        {error && <p className="login-error">{error}</p>}

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-confirm-deposit" onClick={handleConfirm}>
            Place Bet
          </button>
        </div>
      </div>
    </div>
  );
}

export default BetModal;