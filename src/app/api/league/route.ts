import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/lib/stats-service';
import { mockTeams, mockMatchups, mockBoxScores, mockLeagueStats, mockLeagueInfo } from '@/lib/mock-data';
// Removed unused imports: BoxScore, Matchup

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const season = parseInt(searchParams.get('season') || process.env.SEASON || '2024');
    const leagueId = parseInt(process.env.LEAGUE_ID || '0');
    const espnS2 = process.env.ESPN_S2;
    const swid = process.env.SWID;

    // Check if we have real ESPN credentials
    const hasESPNCredentials = leagueId && espnS2 && swid;

    console.log('Environment check:', {
      leagueId: leagueId ? `SET (${leagueId})` : 'NOT SET',
      espnS2: espnS2 ? `SET (${espnS2.length} chars)` : 'NOT SET', 
      swid: swid ? `SET (${swid.length} chars)` : 'NOT SET',
      season: season ? `SET (${season})` : 'NOT SET',
      hasCredentials: hasESPNCredentials
    });

    if (hasESPNCredentials) {
      console.log('Attempting to use real ESPN data...');
      
      try {
        // Use direct ESPN API client instead of the problematic library
        const { DirectESPNClient, transformESPNData } = await import('@/lib/espn-api-client');
        const { calculateLeagueStats } = await import('@/lib/utils');
        
        const client = new DirectESPNClient(leagueId, season, espnS2, swid);

        // Fetch basic league data from ESPN
        const [leagueInfo, teams, schedule] = await Promise.all([
          client.getLeagueInfo(),
          client.getTeams(),
          client.getSchedule()
        ]);

        // Transform ESPN data to our format
        const transformedData = transformESPNData({
          leagueInfo,
          teams,
          schedule,
          boxScores: []
        });

        // Use the already-filtered completed matchups from transformed data
        const completedMatchups = transformedData.schedule;
        
        // Calculate statistics using transformed data
        const leagueStats = calculateLeagueStats(transformedData.teams, completedMatchups, []);
        const { StatsService } = await import('@/lib/stats-service');
        const rivalries = StatsService.calculateRivalries(transformedData.teams, completedMatchups);
        const seasonSummary = StatsService.calculateSeasonSummary(season, transformedData.teams, completedMatchups, []);
        const records = StatsService.findLeagueRecords(transformedData.teams, completedMatchups, []);

        const response = {
          leagueInfo: transformedData.leagueInfo,
          teams: transformedData.teams,
          schedule: completedMatchups,
          boxScores: [],
          stats: {
            leagueStats,
            rivalries,
            seasonSummary,
            records
          }
        };

        console.log('Successfully loaded real ESPN data!');
        return NextResponse.json(response);
      } catch (espnError) {
        console.error('ESPN API Error Details:', {
          message: espnError instanceof Error ? espnError.message : 'Unknown error',
          stack: espnError instanceof Error ? espnError.stack : undefined,
          type: typeof espnError,
          error: espnError
        });
        console.error('ESPN API failed, falling back to demo data');
        // Fall through to demo data
      }
    }

    console.log('Using demo data - no ESPN credentials provided or ESPN API failed');
    
    // Use mock data fallback
    const rivalries = StatsService.calculateRivalries(mockTeams, mockMatchups);
    const seasonSummary = StatsService.calculateSeasonSummary(season, mockTeams, mockMatchups, mockBoxScores);
    const records = StatsService.findLeagueRecords(mockTeams, mockMatchups, mockBoxScores);

    const response = {
      leagueInfo: {
        ...mockLeagueInfo,
        name: hasESPNCredentials 
          ? 'Fantasy Football League History Dashboard (ESPN API Error)'
          : 'Fantasy Football League History Dashboard (Demo)'
      },
      teams: mockTeams,
      schedule: mockMatchups,
      boxScores: mockBoxScores,
      stats: {
        leagueStats: mockLeagueStats,
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
    const { action } = body;

    if (action === 'test-connection') {
      return NextResponse.json({
        success: true,
        leagueName: 'Demo Fantasy League',
        season: 2024,
        note: 'Currently running in demo mode'
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