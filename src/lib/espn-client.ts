import { Client } from 'espn-fantasy-football-api';
import { Team, Matchup, BoxScore, DraftPick, Trade, Transaction } from '@/types/fantasy';

export class FantasyLeagueClient {
  private client: Client;
  private leagueId: number;
  private season: number;

  constructor(leagueId: number, season: number, espnS2?: string, swid?: string) {
    this.leagueId = leagueId;
    this.season = season;
    
    this.client = new Client({
      leagueId,
      seasonId: season,
      espnS2,
      swid
    });
  }

  async getLeagueInfo() {
    return await this.client.getLeagueInfo();
  }

  async getTeams(): Promise<Team[]> {
    const teams = await this.client.getTeamsAtWeek({ scoringPeriodId: 1 });
    return teams.map(team => ({
      id: team.id,
      name: team.name,
      owner: team.owners?.[0]?.displayName || 'Unknown',
      abbreviation: team.abbrev,
      logo: team.logo,
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor
    }));
  }

  async getSchedule(): Promise<Matchup[]> {
    const schedule = await this.client.getSchedule();
    const teams = await this.getTeams();
    
    return schedule.map(matchup => {
      const homeTeam = teams.find(t => t.id === matchup.home?.teamId);
      const awayTeam = teams.find(t => t.id === matchup.away?.teamId);
      
      if (!homeTeam || !awayTeam) {
        throw new Error('Team not found in matchup');
      }

      const homeScore = matchup.home?.totalPoints || 0;
      const awayScore = matchup.away?.totalPoints || 0;
      const winner = homeScore > awayScore ? homeTeam : awayTeam;

      return {
        id: `${this.season}-${matchup.matchupPeriodId}-${matchup.id}`,
        season: this.season,
        week: matchup.matchupPeriodId,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        winner,
        isPlayoff: matchup.playoffTierType === 'WINNERS_BRACKET',
        isSemifinal: matchup.playoffTierType === 'WINNERS_BRACKET' && matchup.matchupPeriodId >= 15,
        isFinal: matchup.playoffTierType === 'WINNERS_BRACKET' && matchup.matchupPeriodId >= 16
      };
    });
  }

  async getBoxScoresForWeek(week: number): Promise<BoxScore[]> {
    const boxscores = await this.client.getBoxscoreForWeek({ matchupPeriodId: week });
    const results: BoxScore[] = [];

    for (const boxscore of boxscores) {
      const homeRoster = boxscore.homeRoster || [];
      const awayRoster = boxscore.awayRoster || [];

      [...homeRoster, ...awayRoster].forEach(player => {
        results.push({
          id: `${this.season}-${week}-${boxscore.id}-${player.id}`,
          matchupId: `${this.season}-${week}-${boxscore.id}`,
          teamId: player.teamId,
          slot: player.slotCategoryId,
          playerId: player.id,
          playerName: player.name,
          projected: player.projectedStats?.appliedTotal || 0,
          actual: player.stats?.appliedTotal || 0,
          onBench: player.slotCategoryId === 'BE',
          position: player.position
        });
      });
    }

    return results;
  }

  async getDraftInfo(): Promise<DraftPick[]> {
    const draft = await this.client.getDraftInfo();
    if (!draft.draftDetail) return [];

    return draft.draftDetail.picks.map(pick => ({
      id: `${this.season}-${pick.roundId}-${pick.pickOrder}`,
      season: this.season,
      round: pick.roundId,
      pickOverall: pick.pickOrder,
      teamId: pick.teamId,
      playerId: pick.playerId,
      playerName: pick.playerName,
      position: pick.playerPosition
    }));
  }

  async getTransactions(): Promise<Transaction[]> {
    // Note: ESPN API doesn't provide historical transactions easily
    // This would need to be implemented based on available endpoints
    return [];
  }

  async getTrades(): Promise<Trade[]> {
    // Note: ESPN API doesn't provide historical trades easily
    // This would need to be implemented based on available endpoints
    return [];
  }

  // Helper method to get all weeks for a season
  async getAllBoxScores(): Promise<BoxScore[]> {
    const leagueInfo = await this.getLeagueInfo();
    const totalWeeks = leagueInfo.settings?.scheduleSettings?.matchupPeriodCount || 17;
    const allBoxScores: BoxScore[] = [];

    for (let week = 1; week <= totalWeeks; week++) {
      try {
        const weekBoxScores = await this.getBoxScoresForWeek(week);
        allBoxScores.push(...weekBoxScores);
      } catch (error) {
        console.warn(`Failed to fetch box scores for week ${week}:`, error);
      }
    }

    return allBoxScores;
  }
} 