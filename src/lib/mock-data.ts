import { Team, Matchup, BoxScore, LeagueStats } from '@/types/fantasy';

// Mock teams data
export const mockTeams: Team[] = [
  { id: 1, name: 'The Dynasty', owner: 'Josh', abbreviation: 'DYN' },
  { id: 2, name: 'Gridiron Gladiators', owner: 'Mike', abbreviation: 'GG' },
  { id: 3, name: 'Fantasy Phenoms', owner: 'Sarah', abbreviation: 'FP' },
  { id: 4, name: 'Touchdown Titans', owner: 'Alex', abbreviation: 'TT' },
  { id: 5, name: 'End Zone Eagles', owner: 'Chris', abbreviation: 'EZE' },
  { id: 6, name: 'Playoff Predators', owner: 'Jordan', abbreviation: 'PP' },
  { id: 7, name: 'Championship Chasers', owner: 'Taylor', abbreviation: 'CC' },
  { id: 8, name: 'Victory Vanguard', owner: 'Morgan', abbreviation: 'VV' },
  { id: 9, name: 'Legendary Lions', owner: 'Casey', abbreviation: 'LL' },
  { id: 10, name: 'Superstar Squad', owner: 'Riley', abbreviation: 'SS' }
];

// Mock matchups data
export const mockMatchups: Matchup[] = [
  {
    id: '2024-1-1',
    season: 2024,
    week: 1,
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 142.5,
    awayScore: 118.3,
    winner: mockTeams[0],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  {
    id: '2024-1-2',
    season: 2024,
    week: 1,
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[3],
    homeScore: 156.8,
    awayScore: 134.2,
    winner: mockTeams[2],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  {
    id: '2024-1-3',
    season: 2024,
    week: 1,
    homeTeam: mockTeams[4],
    awayTeam: mockTeams[5],
    homeScore: 128.9,
    awayScore: 145.7,
    winner: mockTeams[5],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  {
    id: '2024-1-4',
    season: 2024,
    week: 1,
    homeTeam: mockTeams[6],
    awayTeam: mockTeams[7],
    homeScore: 162.1,
    awayScore: 139.4,
    winner: mockTeams[6],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  {
    id: '2024-1-5',
    season: 2024,
    week: 1,
    homeTeam: mockTeams[8],
    awayTeam: mockTeams[9],
    homeScore: 121.6,
    awayScore: 158.3,
    winner: mockTeams[9],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  // Week 2
  {
    id: '2024-2-1',
    season: 2024,
    week: 2,
    homeTeam: mockTeams[1],
    awayTeam: mockTeams[2],
    homeScore: 149.2,
    awayScore: 132.8,
    winner: mockTeams[1],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  {
    id: '2024-2-2',
    season: 2024,
    week: 2,
    homeTeam: mockTeams[3],
    awayTeam: mockTeams[4],
    homeScore: 138.5,
    awayScore: 156.9,
    winner: mockTeams[4],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  {
    id: '2024-2-3',
    season: 2024,
    week: 2,
    homeTeam: mockTeams[5],
    awayTeam: mockTeams[6],
    homeScore: 144.7,
    awayScore: 141.3,
    winner: mockTeams[5],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  {
    id: '2024-2-4',
    season: 2024,
    week: 2,
    homeTeam: mockTeams[7],
    awayTeam: mockTeams[8],
    homeScore: 167.4,
    awayScore: 125.1,
    winner: mockTeams[7],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  },
  {
    id: '2024-2-5',
    season: 2024,
    week: 2,
    homeTeam: mockTeams[9],
    awayTeam: mockTeams[0],
    homeScore: 133.6,
    awayScore: 148.9,
    winner: mockTeams[0],
    isPlayoff: false,
    isSemifinal: false,
    isFinal: false
  }
];

// Mock box scores (simplified)
export const mockBoxScores: BoxScore[] = [
  {
    id: '2024-1-1-player1',
    matchupId: '2024-1-1',
    teamId: 1,
    slot: 'QB',
    playerId: 'player1',
    playerName: 'Josh Allen',
    projected: 22.5,
    actual: 28.3,
    onBench: false,
    position: 'QB'
  },
  {
    id: '2024-1-1-player2',
    matchupId: '2024-1-1',
    teamId: 1,
    slot: 'BE',
    playerId: 'player2',
    playerName: 'Backup RB',
    projected: 8.2,
    actual: 15.7,
    onBench: true,
    position: 'RB'
  }
];

// Generate mock league stats
export const mockLeagueStats: LeagueStats[] = mockTeams.map((team) => ({
  teamId: team.id,
  wins: Math.floor(Math.random() * 8) + 4,
  losses: Math.floor(Math.random() * 8) + 4,
  ties: Math.floor(Math.random() * 2),
  pointsFor: 1200 + Math.random() * 400,
  pointsAgainst: 1200 + Math.random() * 400,
  averageScore: 120 + Math.random() * 40,
  highestScore: 160 + Math.random() * 40,
  lowestScore: 80 + Math.random() * 40,
  biggestWin: 20 + Math.random() * 40,
  biggestLoss: 20 + Math.random() * 40,
  longestWinStreak: Math.floor(Math.random() * 6) + 1,
  longestLossStreak: Math.floor(Math.random() * 5) + 1,
  pointsLeftOnBench: 50 + Math.random() * 100,
  optimalLineupPoints: 1400 + Math.random() * 200
}));

export const mockLeagueInfo = {
  name: 'Demo Fantasy League',
  season: 2024,
  totalTeams: 10,
  totalWeeks: 17
}; 