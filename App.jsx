import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import { sports } from "./data/mockData";
import { getMatchesBySport, getMatchById } from "./services/matchService";
import MatchCard from "./components/MatchCard";
import MatchDetails from "./components/MatchDetails";
import SportNav from "./components/SportNav";
import Login from "./components/login.jsx";
import WalletModal from "./components/walletmodal.jsx";
import BetModal from "./components/betmodal.jsx";
import SuccessModal from "./components/SuccessModal";
import MyBets from "./components/MyBets";
import Account from "./components/Account";
import BettingArena from "./components/BettingArena";
import HouseWallet from "./components/HouseWallet";
import { supabase } from "./lib/supabase.js";

function HomePage({
  user,
  onLogout,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenMyBets,
  onOpenAccount,
  onOpenArena,
  onOpenHouse,
  setAllMatches,
}) {
  const [selectedSport, setSelectedSport] = useState("Football");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCompetition, setSelectedCompetition] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("All");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      const data = await getMatchesBySport(selectedSport);
      setMatches(data);
      setAllMatches(data);
      setLoading(false);
    }
    loadMatches();
  }, [selectedSport, setAllMatches]);

  const liveMatches = matches.filter(
    (m) => m.status === "LIVE" || m.status === "HT"
  );

  const tabs = ["All", "Live", "Upcoming", "Results"];
  const competitions = ["All", ...new Set(matches.map((m) => m.competition))];

  const filteredMatches = matches.filter((match) => {
    const tabMatch =
      activeTab === "All" ||
      (activeTab === "Live" && (match.status === "LIVE" || match.status === "HT")) ||
      (activeTab === "Upcoming" && match.status === "NS") ||
      (activeTab === "Results" && match.status === "FT");

    const competitionMatch =
      selectedCompetition === "All" || match.competition === selectedCompetition;

    const searchMatch =
      match.home.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.away.toLowerCase().includes(searchQuery.toLowerCase());

    const today = "2026-09-13";
    const tomorrow = "2026-09-14";

    let dateMatch = true;
    if (selectedDate === "Today") {
      dateMatch = match.date === today || match.date === "2026-09-12";
    }
    if (selectedDate === "Tomorrow") {
      dateMatch = match.date === tomorrow;
    }

    return tabMatch && competitionMatch && searchMatch && dateMatch;
  });

  const handleSportSelect = (sportId) => {
    setSelectedSport(sportId);
    setActiveTab("All");
    setSelectedCompetition("All");
    setSearchQuery("");
    setSelectedDate("All");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div>
            <h1 className="logo">BETRIX</h1>
            <p className="subtitle">Sports Centre</p>
          </div>
          <div className="user-info">
            <div className="wallet-balance">
              ₦{user.balance.toLocaleString()}
            </div>
            <button className="deposit-btn" onClick={onOpenDeposit}>
              Deposit
            </button>
            <button className="withdraw-btn" onClick={onOpenWithdraw}>
              Withdraw
            </button>
            <button className="mybets-btn" onClick={onOpenMyBets}>
              My Bets
            </button>
            <button className="mybets-btn" onClick={onOpenArena} style={{ borderColor: "rgba(255,45,120,0.4)", color: "#ff6b9d" }}>
              Arena
            </button>
            <button className="account-btn-header" onClick={onOpenAccount}>
              Account
            </button>
            <button className="withdraw-btn" onClick={onOpenHouse}>
              House
            </button>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <SportNav
        sports={sports}
        selectedSport={selectedSport}
        onSelect={handleSportSelect}
      />

      {liveMatches.length > 0 && (
        <div className="live-banner">
          <div className="live-badge">
            <span className="live-dot"></span>
            LIVE
          </div>
          {liveMatches.map((m) => (
            <div
              key={m.id}
              className="live-match-chip"
              onClick={() => navigate(`/match/${m.id}`)}
            >
              <span>{m.home}</span>
              <span className="score">{m.score}</span>
              <span>{m.away}</span>
              <span style={{ color: "var(--live)", fontSize: "0.75rem" }}>
                {m.time}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="date-filter">
        {["All", "Today", "Tomorrow"].map((date) => (
          <button
            key={date}
            className={`date-btn ${selectedDate === date ? "active" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {date}
          </button>
        ))}
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="competition-filter">
        <select
          value={selectedCompetition}
          onChange={(e) => setSelectedCompetition(e.target.value)}
        >
          {competitions.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>
      </div>

      <main className="main">
        <div className="section-header">
          <h2>
            {selectedSport} — {activeTab}
          </h2>
          <span className="match-count">
            {loading ? "Loading..." : `${filteredMatches.length} matches`}
          </span>
        </div>

        <div className="matches">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading matches...</p>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="empty-state">No matches found</div>
          ) : (
            filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => navigate(`/match/${match.id}`)}
              />
            ))
          )}
        </div>
      </main>

      <footer className="footer">
        <p>BETRIX Sports Centre</p>
        <p className="footer-sub">Live scores & fixtures</p>
        <p className="footer-updated">Last updated: just now</p>
      </footer>
    </div>
  );
}

function MatchDetailsPage({ user, onPlaceBetConfirm, allMatches }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [betData, setBetData] = useState(null);

  const match =
    allMatches.find((m) => String(m.id) === String(id)) || getMatchById(id);

  if (!match) {
    return (
      <div className="app">
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Match not found
        </p>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    );
  }

  let sport = "Football";
  if (match.competition === "NBA" || match.competition === "EuroLeague") {
    sport = "Basketball";
  } else if (
    match.competition?.includes("ATP") ||
    match.competition?.includes("WTA")
  ) {
    sport = "Tennis";
  }

  const handlePlaceBet = (selection, odd) => {
    setBetData({ selection, odd });
  };

  return (
    <>
      <MatchDetails
        match={match}
        sport={sport}
        onBack={() => navigate("/")}
        onPlaceBet={handlePlaceBet}
      />

      {betData && (
        <BetModal
          match={match}
          selection={betData.selection}
          odd={betData.odd}
          currentBalance={user.balance}
          onClose={() => setBetData(null)}
          onConfirm={onPlaceBetConfirm}
        />
      )}
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [bets, setBets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showMyBets, setShowMyBets] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showArena, setShowArena] = useState(false);
  const [showHouse, setShowHouse] = useState(false);
  const [allMatches, setAllMatches] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("betrix_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedBets = localStorage.getItem("betrix_bets");
    if (savedBets) {
      setBets(JSON.parse(savedBets));
    }

    const savedTransactions = localStorage.getItem("betrix_transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("betrix_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("betrix_user");
    setShowAccount(false);
    setShowMyBets(false);
  };

  const addTransaction = (type, amount) => {
    const newTransaction = {
      id: Date.now(),
      type, // "deposit" or "withdraw"
      amount,
      date: new Date().toLocaleString(),
    };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem("betrix_transactions", JSON.stringify(updated));
  };

  const handleConfirmWallet = (amount) => {
    if (modalType === "deposit") {
      const updatedUser = {
        ...user,
        balance: user.balance + amount,
      };
      setUser(updatedUser);
      localStorage.setItem("betrix_user", JSON.stringify(updatedUser));
      addTransaction("deposit", amount);
    }

    if (modalType === "withdraw") {
      const updatedUser = {
        ...user,
        balance: user.balance - amount,
      };
      setUser(updatedUser);
      localStorage.setItem("betrix_user", JSON.stringify(updatedUser));
      addTransaction("withdraw", amount);
    }
  };

  const handlePlaceBetConfirm = (bet) => {
    const updatedUser = {
      ...user,
      balance: user.balance - bet.stake,
    };
    setUser(updatedUser);
    localStorage.setItem("betrix_user", JSON.stringify(updatedUser));

    // Also update balance in Supabase profiles
    if (user.id) {
      supabase
        ?.from?.("profiles")
        ?.update({ balance: updatedUser.balance })
        ?.eq("id", user.id)
        ?.then?.(() => {})
        ?.catch?.(() => {});
    }

    const newBet = {
      ...bet,
      id: Date.now(),
      status: "pending",
      placedAt: new Date().toLocaleString(),
      userId: user.id,
    };

    const updatedBets = [newBet, ...bets];
    setBets(updatedBets);
    localStorage.setItem("betrix_bets", JSON.stringify(updatedBets));

    // House receives the stake immediately (bookmaker model)
    const house = JSON.parse(localStorage.getItem("betrix_house") || '{"balance":0}');
    house.balance = (house.balance || 0) + bet.stake;
    localStorage.setItem("betrix_house", JSON.stringify(house));

    setSuccessMessage(
      `${bet.match}\n${bet.selection} @ ${bet.odd}\nStake: ₦${bet.stake.toLocaleString()}\nPotential Win: ₦${bet.potentialWin.toLocaleString()}`
    );
  };

  // Settle a bet: if lost, stake stays with house; if won, pay user from house
  const settleBet = (betId, result) => {
    const updatedBets = bets.map((b) => {
      if (b.id !== betId || b.status !== "pending") return b;
      return { ...b, status: result };
    });
    setBets(updatedBets);
    localStorage.setItem("betrix_bets", JSON.stringify(updatedBets));

    const bet = bets.find((b) => b.id === betId);
    if (!bet) return;

    const house = JSON.parse(localStorage.getItem("betrix_house") || '{"balance":0}');

    if (result === "won") {
      const payout = bet.potentialWin;
      const updatedUser = {
        ...user,
        balance: user.balance + payout,
      };
      setUser(updatedUser);
      localStorage.setItem("betrix_user", JSON.stringify(updatedUser));
      house.balance = Math.max(0, (house.balance || 0) - payout);
    }
    // if lost: stake already in house, nothing more to do

    localStorage.setItem("betrix_house", JSON.stringify(house));
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (showAccount) {
    return (
      <Account
        user={user}
        bets={bets}
        transactions={transactions}
        onBack={() => setShowAccount(false)}
        onLogout={handleLogout}
      />
    );
  }

  if (showMyBets) {
    return (
      <MyBets
        bets={bets}
        onBack={() => setShowMyBets(false)}
        onSettle={settleBet}
      />
    );
  }

  if (showArena) {
    return (
      <BettingArena
        matches={allMatches}
        user={user}
        onPlaceBet={(bet) => {
          handlePlaceBetConfirm(bet);
          setShowArena(false);
        }}
        onBack={() => setShowArena(false)}
      />
    );
  }

  if (showHouse) {
    return <HouseWallet onBack={() => setShowHouse(false)} />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              onLogout={handleLogout}
              onOpenDeposit={() => setModalType("deposit")}
              onOpenWithdraw={() => setModalType("withdraw")}
              onOpenMyBets={() => setShowMyBets(true)}
              onOpenAccount={() => setShowAccount(true)}
              onOpenArena={() => setShowArena(true)}
              onOpenHouse={() => setShowHouse(true)}
              setAllMatches={setAllMatches}
            />
          }
        />
        <Route
          path="/match/:id"
          element={
            <MatchDetailsPage
              user={user}
              onPlaceBetConfirm={handlePlaceBetConfirm}
              allMatches={allMatches}
            />
          }
        />
      </Routes>

      {modalType && (
        <WalletModal
          type={modalType}
          currentBalance={user.balance}
          onClose={() => setModalType(null)}
          onConfirm={handleConfirmWallet}
        />
      )}

      {successMessage && (
        <SuccessModal
          title="Bet Placed Successfully!"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}
    </>
  );
}

export default App;