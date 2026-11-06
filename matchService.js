import {
  footballMatches as mockFootball,
  basketballMatches,
  tennisMatches,
} from "../data/mockData";

function formatFootballMatch(match) {
  let status = "NS";
  let time = "-";
  let score = "-";

  if (match.status === "FINISHED") {
    status = "FT";
    time = "Full Time";
    score = `${match.score?.fullTime?.home ?? 0} - ${match.score?.fullTime?.away ?? 0}`;
  } else if (match.status === "IN_PLAY" || match.status === "PAUSED") {
    status = "LIVE";
    time = match.minute ? `${match.minute}'` : "Live";
    score = `${match.score?.fullTime?.home ?? 0} - ${match.score?.fullTime?.away ?? 0}`;
  } else if (match.status === "TIMED" || match.status === "SCHEDULED") {
    status = "NS";
    time = match.utcDate
      ? new Date(match.utcDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";
  }

  return {
    id: match.id,
    home: match.homeTeam?.name || "Home",
    away: match.awayTeam?.name || "Away",
    score,
    status,
    time,
    competition: match.competition?.name || "Unknown",
    venue: match.venue || "TBD",
    date: match.utcDate ? match.utcDate.split("T")[0] : "",
    kickoff: time,
  };
}

async function fetchFootballMatches() {
  // Show mock data immediately
  const mockData = mockFootball;

  try {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 7);

    const dateFrom = today.toISOString().split("T")[0];
    const dateTo = future.toISOString().split("T")[0];

    const response = await fetch(
      `/api/football/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const formatted = (data.matches || []).map(formatFootballMatch);

    if (formatted.length > 0) {
      console.log("Real matches loaded:", formatted.length);
      return formatted;
    }

    return mockData;
  } catch (error) {
    console.warn("Using mock data:", error.message);
    return mockData;
  }
}

export async function getMatchesBySport(sport) {
  if (sport === "Basketball") return basketballMatches;
  if (sport === "Tennis") return tennisMatches;
  return await fetchFootballMatches();
}

export function getMatchById(id) {
  const all = [...mockFootball, ...basketballMatches, ...tennisMatches];
  return all.find((match) => match.id === Number(id));
}