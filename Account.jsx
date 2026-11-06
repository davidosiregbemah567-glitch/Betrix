function Account({ user, bets, transactions = [], onBack, onLogout }) {
  const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalPotential = bets.reduce((sum, bet) => sum + bet.potentialWin, 0);

  return (
    <div className="app">
      <header className="header details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1 className="logo">BETRIX</h1>
          <p className="subtitle">My Account</p>
        </div>
      </header>

      <div className="account-page">
        {/* Profile Card */}
        <div className="account-card">
          <div className="account-avatar">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="account-info">
            <h2>{user.name || "User"}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="account-balance-card">
          <span className="balance-label">Available Balance</span>
          <span className="balance-amount">
            ₦{user.balance.toLocaleString()}
          </span>
        </div>

        {/* Stats */}
        <div className="account-stats">
          <div className="stat-box">
            <span className="stat-value">{bets.length}</span>
            <span className="stat-label">Total Bets</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">₦{totalStaked.toLocaleString()}</span>
            <span className="stat-label">Total Staked</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">
              ₦{totalPotential.toLocaleString()}
            </span>
            <span className="stat-label">Potential Wins</span>
          </div>
        </div>

        {/* Transaction History */}
        <div className="transaction-section">
          <h3>Transaction History</h3>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="transaction-row">
                <div>
                  <span
                    className={`tx-type ${
                      tx.type === "deposit" ? "deposit" : "withdraw"
                    }`}
                  >
                    {tx.type === "deposit" ? "Deposit" : "Withdraw"}
                  </span>
                  <p className="tx-date">{tx.date}</p>
                </div>
                <span
                  className={`tx-amount ${
                    tx.type === "deposit" ? "plus" : "minus"
                  }`}
                >
                  {tx.type === "deposit" ? "+" : "-"}₦
                  {tx.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="account-actions">
          <button className="account-btn logout-full" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;