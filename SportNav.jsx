function SportNav({ sports, selectedSport, onSelect }) {
  return (
    <nav className="sports-nav">
      {sports.map((sport) => (
        <button
          key={sport.id}
          className={`sport-card ${selectedSport === sport.id ? "active" : ""}`}
          onClick={() => onSelect(sport.id)}
        >
          <span className="sport-icon">{sport.icon}</span>
          <span className="sport-label">{sport.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default SportNav;