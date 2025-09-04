import { NextRequest, NextResponse } from 'next/server';
import { FantasyLeagueClient } from '@/lib/espn-client';
import { calculateLeagueStats } from '@/lib/utils';
import { StatsService } from '@/lib/stats-service';
import { Matchup, BoxScore } from '@/types/fantasy';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const season = parseInt(searchParams.get('season') || process.env.SEASON || '2024');
    const leagueId = parseInt(process.env.LEAGUE_ID || '0');
    const espnS2 = process.env.ESPN_S2;
    const swid = process.env.SWID;

    if (!leagueId) {
      return NextResponse.json({ error: 'League ID not configured' }, { status: 400 });
    }

    // Initialize the ESPN client
    const client = new FantasyLeagueClient(leagueId, season, espnS2, swid);

    // Fetch basic league data
    const [leagueInfo, teams, schedule] = await Promise.all([
      client.getLeagueInfo(),
      client.getTeams(),
      client.getSchedule()
    ]);

    // Fetch box scores for completed weeks only
    const completedMatchups = schedule.filter((m: Matchup) => m.homeScore > 0 || m.awayScore > 0);
    const completedWeeks = [...new Set(completedMatchups.map((m: Matchup) => m.week))];
    
    const allBoxScores: BoxScore[] = [];
    
    // Fetch box scores for each completed week
    for (const week of completedWeeks.slice(0, 5)) { // Limit to first 5 weeks for demo
      try {
        const weekBoxScores = await client.getBoxScoresForWeek(Number(week));
        allBoxScores.push(...weekBoxScores);
      } catch (error) {
        console.warn(`Failed to fetch box scores for week ${week}:`, error);
      }
    }

    // Calculate statistics
    const leagueStats = calculateLeagueStats(teams, completedMatchups, allBoxScores);
    const rivalries = StatsService.calculateRivalries(teams, completedMatchups);
    const seasonSummary = StatsService.calculateSeasonSummary(season, teams, completedMatchups, allBoxScores);
    const records = StatsService.findLeagueRecords(teams, completedMatchups, allBoxScores);

    const response = {
      leagueInfo: {
        name: leagueInfo.settings?.name || 'Fantasy League',
        season,
        totalTeams: teams.length,
        totalWeeks: leagueInfo.settings?.scheduleSettings?.matchupPeriodCount || 17
      },
      teams,
      schedule: completedMatchups,
      boxScores: allBoxScores,
      stats: {
        leagueStats,
        rivalries,
        seasonSummary,
        records
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching league data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch league data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, season, leagueId, espnS2, swid } = body;

    if (action === 'test-connection') {
      const client = new FantasyLeagueClient(leagueId, season, espnS2, swid);
      const leagueInfo = await client.getLeagueInfo();
      
      return NextResponse.json({
        success: true,
        leagueName: leagueInfo.settings?.name || 'Unknown League',
        season: season
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 