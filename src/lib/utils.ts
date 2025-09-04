import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Team, Matchup, BoxScore, LeagueStats } from '@/types/fantasy';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateLeagueStats(
  teams: Team[], 
  matchups: Matchup[], 
  boxScores: BoxScore[]
): LeagueStats[] {
  return teams.map(team => {
    const teamMatchups = matchups.filter(m => 
      m.homeTeam.id === team.id || m.awayTeam.id === team.id
    );

    let wins = 0;
    let losses = 0;
    let ties = 0;
    let pointsFor = 0;
    let pointsAgainst = 0;
    let highestScore = 0;
    let lowestScore = Infinity;
    let biggestWin = 0;
    let biggestLoss = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let longestWinStreak = 0;
    let longestLossStreak = 0;

    teamMatchups.forEach(matchup => {
      const isHome = matchup.homeTeam.id === team.id;
      const teamScore = isHome ? matchup.homeScore : matchup.awayScore;
      const opponentScore = isHome ? matchup.awayScore : matchup.homeScore;
      
      pointsFor += teamScore;
      pointsAgainst += opponentScore;
      
      if (teamScore > highestScore) highestScore = teamScore;
      if (teamScore < lowestScore) lowestScore = teamScore;
      
      if (teamScore > opponentScore) {
        wins++;
        const margin = teamScore - opponentScore;
        if (margin > biggestWin) biggestWin = margin;
        
        currentWinStreak++;
        currentLossStreak = 0;
        if (currentWinStreak > longestWinStreak) longestWinStreak = currentWinStreak;
      } else if (teamScore < opponentScore) {
        losses++;
        const margin = opponentScore - teamScore;
        if (margin > biggestLoss) biggestLoss = margin;
        
        currentLossStreak++;
        currentWinStreak = 0;
        if (currentLossStreak > longestLossStreak) longestLossStreak = currentLossStreak;
      } else {
        ties++;
        currentWinStreak = 0;
        currentLossStreak = 0;
      }
    });

    // Calculate points left on bench
    const teamBoxScores = boxScores.filter(bs => bs.teamId === team.id);
    const pointsLeftOnBench = teamBoxScores
      .filter(bs => bs.onBench)
      .reduce((sum, bs) => sum + bs.actual, 0);

    // Calculate optimal lineup points
    const optimalLineupPoints = teamBoxScores
      .reduce((sum, bs) => sum + Math.max(bs.actual, 0), 0);

    return {
      teamId: team.id,
      wins,
      losses,
      ties,
      pointsFor,
      pointsAgainst,
      averageScore: pointsFor / (wins + losses + ties) || 0,
      highestScore: highestScore === 0 ? 0 : highestScore,
      lowestScore: lowestScore === Infinity ? 0 : lowestScore,
      biggestWin,
      biggestLoss,
      longestWinStreak,
      longestLossStreak,
      pointsLeftOnBench,
      optimalLineupPoints
    };
  });
}

export function formatScore(score: number): string {
  return score.toFixed(2);
}

export function formatRecord(wins: number, losses: number, ties: number = 0): string {
  return ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
}

export function getWinPercentage(wins: number, losses: number, ties: number = 0): number {
  const totalGames = wins + losses + ties;
  if (totalGames === 0) return 0;
  return ((wins + ties * 0.5) / totalGames) * 100;
}

export function getRankSuffix(rank: number): string {
  if (rank >= 11 && rank <= 13) return 'th';
  switch (rank % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
} 