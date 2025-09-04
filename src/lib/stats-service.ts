import { Team, Matchup, BoxScore, RivalryStats, SeasonSummary } from '@/types/fantasy';
import { calculateLeagueStats } from './utils';

export class StatsService {
  static calculateRivalries(teams: Team[], matchups: Matchup[]): RivalryStats[] {
    const rivalries: RivalryStats[] = [];
    
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];
        
        const headToHeadMatchups = matchups.filter(m =>
          (m.homeTeam.id === team1.id && m.awayTeam.id === team2.id) ||
          (m.homeTeam.id === team2.id && m.awayTeam.id === team1.id)
        );
        
        let team1Wins = 0;
        let team2Wins = 0;
        let team1Points = 0;
        let team2Points = 0;
        let lastMeeting = '';
        
        headToHeadMatchups.forEach(matchup => {
          const team1IsHome = matchup.homeTeam.id === team1.id;
          const team1Score = team1IsHome ? matchup.homeScore : matchup.awayScore;
          const team2Score = team1IsHome ? matchup.awayScore : matchup.homeScore;
          
          team1Points += team1Score;
          team2Points += team2Score;
          
          if (team1Score > team2Score) {
            team1Wins++;
          } else if (team2Score > team1Score) {
            team2Wins++;
          }
          
          lastMeeting = `${matchup.season} Week ${matchup.week}`;
        });
        
        const averageMargin = headToHeadMatchups.length > 0 
          ? Math.abs(team1Points - team2Points) / headToHeadMatchups.length 
          : 0;
        
        rivalries.push({
          team1Id: team1.id,
          team2Id: team2.id,
          team1Wins,
          team2Wins,
          team1Points,
          team2Points,
          averageMargin,
          lastMeeting
        });
      }
    }
    
    return rivalries;
  }
  
  static calculateSeasonSummary(
    season: number,
    teams: Team[],
    matchups: Matchup[],
    boxScores: BoxScore[]
  ): SeasonSummary {
    const seasonMatchups = matchups.filter(m => m.season === season);
    const seasonBoxScores = boxScores.filter(bs => bs.matchupId.startsWith(`${season}-`));
    const stats = calculateLeagueStats(teams, seasonMatchups, seasonBoxScores);
    
    // Find champion (winner of final)
    const finalMatchup = seasonMatchups.find(m => m.isFinal);
    const champion = finalMatchup?.winner || teams[0];
    const runnerUp = finalMatchup 
      ? (finalMatchup.homeTeam.id === champion.id ? finalMatchup.awayTeam : finalMatchup.homeTeam)
      : teams[1];
    
    // Regular season champion (most wins, then points)
    const regularSeasonChampion = stats
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.pointsFor - a.pointsFor;
      })[0];
    
    const regularSeasonChampionTeam = teams.find(t => t.id === regularSeasonChampion.teamId) || teams[0];
    
    // Calculate averages and extremes
    const allScores = seasonMatchups.flatMap(m => [m.homeScore, m.awayScore]);
    const averageScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
    const highestScore = Math.max(...allScores);
    const lowestScore = Math.min(...allScores);
    
    // Find most active teams (placeholder - would need transaction data)
    const mostTrades = teams[0];
    const mostActive = teams[0];
    
    return {
      season,
      champion,
      runnerUp,
      regularSeasonChampion: regularSeasonChampionTeam,
      totalTeams: teams.length,
      totalWeeks: Math.max(...seasonMatchups.map(m => m.week)),
      averageScore,
      highestScore,
      lowestScore,
      mostTrades,
      mostActive
    };
  }
  
  static findLeagueRecords(teams: Team[], matchups: Matchup[], boxScores: BoxScore[]) {
    let highestSingleWeek = { team: teams[0], score: 0, week: 0, season: 0 };
    let lowestWinningScore = { team: teams[0], score: Infinity, week: 0, season: 0 };
    let biggestBlowout = { winner: teams[0], loser: teams[0], margin: 0, week: 0, season: 0 };
    let mostPointsInLoss = { team: teams[0], score: 0, week: 0, season: 0 };
    let mostPointsLeftOnBench = { team: teams[0], points: 0, week: 0, season: 0 };
    
    matchups.forEach(matchup => {
      // Highest single week
      if (matchup.homeScore > highestSingleWeek.score) {
        highestSingleWeek = {
          team: matchup.homeTeam,
          score: matchup.homeScore,
          week: matchup.week,
          season: matchup.season
        };
      }
      if (matchup.awayScore > highestSingleWeek.score) {
        highestSingleWeek = {
          team: matchup.awayTeam,
          score: matchup.awayScore,
          week: matchup.week,
          season: matchup.season
        };
      }
      
      // Lowest winning score
      const winningScore = Math.max(matchup.homeScore, matchup.awayScore);
      if (winningScore < lowestWinningScore.score) {
        lowestWinningScore = {
          team: matchup.winner,
          score: winningScore,
          week: matchup.week,
          season: matchup.season
        };
      }
      
      // Biggest blowout
      const margin = Math.abs(matchup.homeScore - matchup.awayScore);
      if (margin > biggestBlowout.margin) {
        const loser = matchup.homeScore > matchup.awayScore ? matchup.awayTeam : matchup.homeTeam;
        biggestBlowout = {
          winner: matchup.winner,
          loser,
          margin,
          week: matchup.week,
          season: matchup.season
        };
      }
      
      // Most points in a loss
      const losingScore = Math.min(matchup.homeScore, matchup.awayScore);
      if (losingScore > mostPointsInLoss.score) {
        const loser = matchup.homeScore < matchup.awayScore ? matchup.homeTeam : matchup.awayTeam;
        mostPointsInLoss = {
          team: loser,
          score: losingScore,
          week: matchup.week,
          season: matchup.season
        };
      }
    });
    
    // Most points left on bench (would need more detailed box score analysis)
    // This is a simplified version
    const benchPoints = new Map<string, number>();
    boxScores.filter(bs => bs.onBench).forEach(bs => {
      const key = `${bs.teamId}-${bs.matchupId}`;
      benchPoints.set(key, (benchPoints.get(key) || 0) + bs.actual);
    });
    
    let maxBenchPoints = 0;
    let maxBenchKey = '';
    benchPoints.forEach((points, key) => {
      if (points > maxBenchPoints) {
        maxBenchPoints = points;
        maxBenchKey = key;
      }
    });
    
    if (maxBenchKey) {
      const [teamId, matchupId] = maxBenchKey.split('-');
      const [season, week] = matchupId.split('-').slice(0, 2);
      const team = teams.find(t => t.id === parseInt(teamId)) || teams[0];
      mostPointsLeftOnBench = {
        team,
        points: maxBenchPoints,
        week: parseInt(week),
        season: parseInt(season)
      };
    }
    
    // Calculate win/loss streaks (simplified)
    const longestWinStreak = { team: teams[0], streak: 0, seasons: [0] };
    const longestLossStreak = { team: teams[0], streak: 0, seasons: [0] };
    
    return {
      highestSingleWeek,
      lowestWinningScore,
      biggestBlowout,
      longestWinStreak,
      longestLossStreak,
      mostPointsInLoss,
      mostPointsLeftOnBench
    };
  }
} 