import { useState, useMemo } from "react";

function BettingArena({ matches, user, onPlaceBet, onBack }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selection, setSelection] = useState(null);
  const [odd, setOdd] = useState(null);
  const [stake, setStake] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const openMatches = useMemo(() => {
    return matches.filter((m) => {
      if (filter === "Live") return m.status === "LIVE" || m.status === "HT";
      if (filter === "Upcoming") return m.status === "NS";
      return m.status === "LIVE" || m.status === "HT" || m.status === "NS";
    });
  }, [matches, filter]);

  const oddsFor = (match) => ({
    home: "2.10",
    draw: "3.40",
    away: "3.25",
  });

  const potentialWin =
    stake && odd ? (Number(stake) * Number(odd)).toFixed(2) : "0.00";

  const handleSelectOdd = (match, sel, o) => {
    setSelectedMatch(match);
    setSelection(sel);
    setOdd(o);
    setStake("");
    setError("");
  };

  const handleConfirm = () => {
    const value = Number(stake);
    if (!value || value <= 0) {
      setError("Enter a valid stake");
      return;
    }
    if (value > user.balance) {
      setError("Insufficient balance");
      return;
    }
    if (!selectedMatch || !selection || !odd) {
      setError("Select a match and odd first");
      return;
    }

    onPlaceBet({
      match: `${selectedMatch.home} vs ${selectedMatch.away}`,
      matchId: selectedMatch.id,
      selection,
      odd,
      stake: value,
      potentialWin: Number(potentialWin),
    });

    setSelectedMatch(null);
    setSelection(null);
    setOdd(null);
    setStake("");
    setError("");
  };

  return (
    <div className="app">
      <header className="header details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1 className="logo">BETRIX</h1>
          <p className="subtitle">Betting Arena</p>
        </div>
      </header>

      <div className="wallet-balance" style={{ marginBottom: 16, display: "inline-block" }}>
        Balance: ₦{user.balance.toLocaleString()}
      </div>

      <div className="tabs" style={{ marginBottom: 16 }}>
        {["All", "Live", "Upcoming"].map((f) => (
          <button
            key={f}
            className={`tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="matches">
        {openMatches.length === 0 ? (
          <div className="empty-state">No matches available to bet on</div>
        ) : (
          openMatches.map((match) => {
            const o = oddsFor(match);
            const isSelected = selectedMatch?.id === match.id;
            return (
              <div
                key={match.id}
                className="page-card"
                style={{
                  borderColor: isSelected ? "var(--accent)" : undefined,
                  boxShadow: isSelected ? "var(--glow)" : undefined,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                    {match.competition}
                  </span>
                  <span className={`match-status ${match.status.toLowerCase()}`}>
                    {match.status === "NS" ? match.time : match.status}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontWeight: 700, flex: 1, textAlign: "right" }}>{match.home}</span>
                  <span className="match-score" style={{ margin: "0 12px" }}>
                    {match.score || "vs"}
                  </span>
                  <span style={{ fontWeight: 700, flex: 1, textAlign: "left" }}>{match.away}</span>
                </div>

                <div className="odds-grid">
                  <button
                    className="odd-btn"
                    onClick={() => handleSelectOdd(match, match.home, o.home)}
                    style={{
                      borderColor:
                        isSelected && selection === match.home
                          ? "var(--accent)"
                          : undefined,
                    }}
                  >
                    <span className="label">1</span>
                    <span className="value">{o.home}</span>
                  </button>
                  <button
                    className="odd-btn"
                    onClick={() => handleSelectOdd(match, "Draw", o.draw)}
                    style={{
                      borderColor:
                        isSelected && selection === "Draw"
                          ? "var(--accent)"
                          : undefined,
                    }}
                  >
                    <span className="label">X</span>
                    <span className="value">{o.draw}</span>
                  </button>
                  <button
                    className="odd-btn"
                    onClick={() => handleSelectOdd(match, match.away, o.away)}
                    style={{
                      borderColor:
                        isSelected && selection === match.away
                          ? "var(--accent)"
                          : undefined,
                    }}
                  >
                    <span className="label">2</span>
                    <span className="value">{o.away}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedMatch && selection && (
        <div
          className="modal-card"
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            right: 16,
            maxWidth: 400,
            margin: "0 auto",
            zIndex: 50,
            border: "1px solid var(--accent)",
            boxShadow: "var(--glow)",
          }}
        >
          <h3>Place Bet</h3>
          <p className="modal-balance">
            {selectedMatch.home} vs {selectedMatch.away}
          </p>
          <p className="bet-selection">
            <strong>{selection}</strong> @ {odd}
          </p>

          <div className="form-group">
            <label>Stake (₦)</label>
            <input
              type="number"
              placeholder="Enter stake"
              value={stake}
              onChange={(e) => {
                setStake(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="potential-win">
            Potential Win: <strong>₦{Number(potentialWin).toLocaleString()}</strong>
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="modal-actions">
            <button
              className="modal-cancel"
              onClick={() => {
                setSelectedMatch(null);
                setSelection(null);
                setOdd(null);
                setStake("");
                setError("");
              }}
            >
              Cancel
            </button>
            <button className="modal-confirm-deposit" onClick={handleConfirm}>
              Confirm Bet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BettingArena;
