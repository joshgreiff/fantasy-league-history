export interface Team {
  id: number;
  name: string;
  owner: string;
  abbreviation: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface Matchup {
  id: string;
  season: number;
  week: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  winner: Team;
  isPlayoff: boolean;
  isSemifinal: boolean;
  isFinal: boolean;
}

export interface BoxScore {
  id: string;
  matchupId: string;
  teamId: number;
  slot: string;
  playerId: string;
  playerName: string;
  projected: number;
  actual: number;
  onBench: boolean;
  position: string;
}

export interface DraftPick {
  id: string;
  season: number;
  round: number;
  pickOverall: number;
  teamId: number;
  playerId: string;
  playerName: string;
  position: string;
}

export interface Trade {
  id: string;
  season: number;
  week: number;
  teamFromId: number;
  teamToId: number;
  playersFrom: string[];
  playersTo: string[];
  details: Record<string, unknown>;
}

export interface Transaction {
  id: string;
  season: number;
  week: number;
  teamId: number;
  type: 'ADD' | 'DROP' | 'TRADE' | 'WAIVER';
  playerName: string;
  details: Record<string, unknown>;
}

export interface LeagueStats {
  teamId: number;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  biggestWin: number;
  biggestLoss: number;
  longestWinStreak: number;
  longestLossStreak: number;
  pointsLeftOnBench: number;
  optimalLineupPoints: number;
}

export interface RivalryStats {
  team1Id: number;
  team2Id: number;
  team1Wins: number;
  team2Wins: number;
  team1Points: number;
  team2Points: number;
  averageMargin: number;
  lastMeeting: string;
}

export interface SeasonSummary {
  season: number;
  champion: Team;
  runnerUp: Team;
  regularSeasonChampion: Team;
  totalTeams: number;
  totalWeeks: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  mostTrades: Team;
  mostActive: Team;
}

export interface LeagueHistory {
  seasons: SeasonSummary[];
  allTimeStats: LeagueStats[];
  rivalries: RivalryStats[];
  records: {
    highestSingleWeek: { team: Team; score: number; week: number; season: number };
    lowestWinningScore: { team: Team; score: number; week: number; season: number };
    biggestBlowout: { winner: Team; loser: Team; margin: number; week: number; season: number };
    longestWinStreak: { team: Team; streak: number; seasons: number[] };
    longestLossStreak: { team: Team; streak: number; seasons: number[] };
    mostPointsInLoss: { team: Team; score: number; week: number; season: number };
    mostPointsLeftOnBench: { team: Team; points: number; week: number; season: number };
  };
}
