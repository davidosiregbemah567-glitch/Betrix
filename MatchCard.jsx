function MatchCard({ match, onClick }) {
  const isUpcoming = match.status === "NS";
  const isLive = match.status === "LIVE" || match.status === "HT";

  return (
    <div className="match-card" onClick={onClick}>
      <div className="match-left">
        <div className="match-top-row">
          <span className="competition-tag">{match.competition}</span>
          {isLive && <span className="live-badge">LIVE</span>}
        </div>

        <div className="match-teams">
          <span className="team home">{match.home}</span>
          <span className="vs">vs</span>
          <span className="team away">{match.away}</span>
        </div>

        {match.venue && (
          <span className="match-venue">{match.venue}</span>
        )}
      </div>

      <div className="match-info">
        <span className="score">
          {isUpcoming ? match.kickoff || match.time : match.score}
        </span>
        <span className={`status ${match.status.toLowerCase()}`}>
          {isUpcoming ? "Upcoming" : match.status}
        </span>
      </div>
    </div>
  );
}

export default MatchCard;