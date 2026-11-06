function MatchDetails({ match, sport, onBack, onPlaceBet }) {
  const events =
    match.status === "FT" || match.status === "LIVE" || match.status === "HT"
      ? [
          { time: "12'", type: "Goal", player: match.home, detail: "1 - 0" },
          { time: "34'", type: "Yellow Card", player: match.away, detail: "" },
          { time: "51'", type: "Goal", player: match.away, detail: "1 - 1" },
          { time: "67'", type: "Goal", player: match.home, detail: "2 - 1" },
        ]
      : [];

  const homeLineup = [
    "1. Goalkeeper",
    "2. Right Back",
    "3. Centre Back",
    "4. Centre Back",
    "5. Left Back",
    "6. Defensive Mid",
    "7. Central Mid",
    "8. Attacking Mid",
    "9. Right Wing",
    "10. Left Wing",
    "11. Striker",
  ];

  const awayLineup = [
    "1. Goalkeeper",
    "2. Right Back",
    "3. Centre Back",
    "4. Centre Back",
    "5. Left Back",
    "6. Defensive Mid",
    "7. Central Mid",
    "8. Attacking Mid",
    "9. Right Wing",
    "10. Left Wing",
    "11. Striker",
  ];

  const odds = {
    home: "2.10",
    draw: "3.40",
    away: "3.25",
  };

  return (
    <div className="app">
      <header className="header details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1 className="logo">BETRIX</h1>
          <p className="subtitle">Match Details</p>
        </div>
      </header>

      <div className="match-details">
        <div className="details-top">
          <span className="details-competition">{match.competition}</span>
          <span className="details-sport">{sport}</span>
        </div>

        <div className="details-teams">
          <div className="details-team">
            <div className="team-badge">{match.home.charAt(0)}</div>
            <span className="team-name">{match.home}</span>
            <span className="team-label">Home</span>
          </div>

          <div className="details-score-block">
            <div className="details-score">{match.score}</div>
            <div className={`details-status status-${match.status.toLowerCase()}`}>
              {match.status === "NS" ? match.time : match.status}
            </div>
          </div>

          <div className="details-team">
            <div className="team-badge">{match.away.charAt(0)}</div>
            <span className="team-name">{match.away}</span>
            <span className="team-label">Away</span>
          </div>
        </div>

        <div className="details-meta">
          <div className="meta-row">
            <span>Status</span>
            <span>{match.time}</span>
          </div>
          <div className="meta-row">
            <span>Date</span>
            <span>{match.date || "—"}</span>
          </div>
          <div className="meta-row">
            <span>Kick-off</span>
            <span>{match.kickoff || "—"}</span>
          </div>
          <div className="meta-row">
            <span>Venue</span>
            <span>{match.venue || "—"}</span>
          </div>
        </div>

        {/* Events */}
        <div className="details-section">
          <h3>Match Events</h3>
          {events.length > 0 ? (
            <div className="events-list">
              {events.map((event, index) => (
                <div key={index} className="event-row">
                  <span className="event-time">{event.time}</span>
                  <span className="event-type">{event.type}</span>
                  <span className="event-player">{event.player}</span>
                  {event.detail && <span className="event-detail">{event.detail}</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder-box">
              <p>No events yet</p>
            </div>
          )}
        </div>

        {/* Lineups */}
        <div className="details-section">
          <h3>Lineups</h3>
          <div className="lineups-grid">
            <div className="lineup-col">
              <h4>{match.home}</h4>
              {homeLineup.map((player, i) => (
                <div key={i} className="lineup-player">{player}</div>
              ))}
            </div>
            <div className="lineup-col">
              <h4>{match.away}</h4>
              {awayLineup.map((player, i) => (
                <div key={i} className="lineup-player">{player}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Odds - Clickable */}
        <div className="details-section">
          <h3>Betting Odds (1X2)</h3>
          <div className="odds-row">
            <button
              className="odd-box"
              onClick={() => onPlaceBet("Home Win", odds.home)}
            >
              <span className="odd-label">1 (Home)</span>
              <span className="odd-value">{odds.home}</span>
            </button>
            <button
              className="odd-box"
              onClick={() => onPlaceBet("Draw", odds.draw)}
            >
              <span className="odd-label">X (Draw)</span>
              <span className="odd-value">{odds.draw}</span>
            </button>
            <button
              className="odd-box"
              onClick={() => onPlaceBet("Away Win", odds.away)}
            >
              <span className="odd-label">2 (Away)</span>
              <span className="odd-value">{odds.away}</span>
            </button>
          </div>
          <p className="bet-note">Click an odd to place a bet</p>
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;