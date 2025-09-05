import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/lib/stats-service';
import { mockTeams, mockMatchups, mockBoxScores, mockLeagueStats, mockLeagueInfo } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const season = parseInt(searchParams.get('season') || process.env.SEASON || '2024');
    
    console.log('Using demo data for Fantasy Football League History Dashboard');
    
    // Use mock data (ESPN API has server-side compatibility issues)
    const rivalries = StatsService.calculateRivalries(mockTeams, mockMatchups);
    const seasonSummary = StatsService.calculateSeasonSummary(season, mockTeams, mockMatchups, mockBoxScores);
    const records = StatsService.findLeagueRecords(mockTeams, mockMatchups, mockBoxScores);

    const response = {
      leagueInfo: {
        ...mockLeagueInfo,
        name: 'Fantasy Football League History Dashboard (Demo)'
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