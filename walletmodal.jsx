import { useState } from "react";

function WalletModal({ type, onClose, onConfirm, currentBalance }) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");

  const isDeposit = type === "deposit";
  const quickAmounts = [1000, 2000, 5000, 10000];

  const handleConfirm = () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!isDeposit && value > currentBalance) {
      setError("Insufficient balance");
      return;
    }

    if (!isDeposit) {
      if (!bankName || !accountName || !accountNumber) {
        setError("Please fill in all bank details");
        return;
      }
    }

    onConfirm(value);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{isDeposit ? "Deposit Money" : "Withdraw Money"}</h3>
        <p className="modal-balance">
          Current Balance: ₦{currentBalance.toLocaleString()}
        </p>

        {isDeposit && (
          <div className="bank-details">
            <p className="bank-title">Pay into this account:</p>
            <div className="bank-row">
              <span>Bank</span>
              <span>PalmPay</span>
            </div>
            <div className="bank-row">
              <span>Account Name</span>
              <span>Hosea Sabastine</span>
            </div>
            <div className="bank-row">
              <span>Account Number</span>
              <span className="account-number">9133935076</span>
            </div>
            <p className="bank-note">
              After payment, enter the amount you sent below and click Deposit.
            </p>
          </div>
        )}

        {!isDeposit && (
          <div className="withdraw-details">
            <p className="bank-title">Enter your bank details:</p>

            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                placeholder="e.g. Access Bank, Opay, PalmPay"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Account Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                placeholder="Your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Amount (₦)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
          />
        </div>

        {isDeposit && (
          <div className="quick-amounts">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                className="quick-btn"
                onClick={() => {
                  setAmount(value);
                  setError("");
                }}
              >
                ₦{value.toLocaleString()}
              </button>
            ))}
          </div>
        )}

        {error && <p className="login-error">{error}</p>}

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className={
              isDeposit ? "modal-confirm-deposit" : "modal-confirm-withdraw"
            }
            onClick={handleConfirm}
          >
            {isDeposit ? "I Have Paid" : "Request Withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WalletModal;