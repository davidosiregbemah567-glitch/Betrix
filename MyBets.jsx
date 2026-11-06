function MyBets({ bets, onBack, onSettle }) {
  return (
    <div className="app">
      <header className="header details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1 className="logo">BETRIX</h1>
          <p className="subtitle">My Bets</p>
        </div>
      </header>

      <div className="my-bets-page">
        {bets.length === 0 ? (
          <div className="empty-state">
            <p>You have not placed any bets yet.</p>
          </div>
        ) : (
          bets.map((bet) => {
            const status = bet.status || "pending";
            return (
              <div key={bet.id || bet.placedAt} className="page-card">
                <div className="bet-item" style={{ flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700 }}>{bet.match}</span>
                    <span className={`status-${status}`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-dim)", fontSize: "0.9rem" }}>
                    <span>{bet.selection} @ {bet.odd}</span>
                    <span>Stake: ₦{Number(bet.stake).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "var(--success)" }}>
                      Potential: ₦{Number(bet.potentialWin).toLocaleString()}
                    </span>
                    {status === "pending" && onSettle && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="deposit-btn"
                          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                          onClick={() => onSettle(bet.id, "won")}
                        >
                          Won
                        </button>
                        <button
                          className="logout-btn"
                          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                          onClick={() => onSettle(bet.id, "lost")}
                        >
                          Lost
                        </button>
                      </div>
                    )}
                  </div>
                  {bet.placedAt && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                      {bet.placedAt}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyBets;
