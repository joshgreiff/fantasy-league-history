import { NextRequest, NextResponse } from 'next/server';
import { StatsService } from '@/lib/stats-service';
import { mockTeams, mockMatchups, mockBoxScores, mockLeagueStats, mockLeagueInfo } from '@/lib/mock-data';
// Removed unused imports: BoxScore, Matchup

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const season = parseInt(searchParams.get('season') || process.env.SEASON || '2025');
    const specificSeasons = searchParams.get('seasons'); // e.g., "2023,2024" or "all"
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

        // Fetch data from multiple seasons (2018-2025) for complete league history
        let allMatchups: any[] = [];
        let allTeams = transformedData.teams;
        const seasonsData: any[] = [];
        const startYear = 2018;
        
        // Determine which seasons to fetch
        let seasonsToFetch: number[] = [];
        if (specificSeasons === 'all' || !specificSeasons) {
          // Fetch all seasons from startYear to current season
          for (let year = startYear; year <= season; year++) {
            seasonsToFetch.push(year);
          }
        } else {
          // Fetch specific seasons
          seasonsToFetch = specificSeasons.split(',').map(s => parseInt(s.trim())).filter(y => y >= startYear && y <= season);
        }
        
        console.log(`Fetching league history for seasons: ${seasonsToFetch.join(', ')}...`);
        
        // Fetch data from each requested season
        for (const year of seasonsToFetch) {
          try {
            console.log(`Fetching ${year} season...`);
            const yearClient = new DirectESPNClient(leagueId, year, espnS2, swid);
            const [yearLeagueInfo, yearTeams, yearSchedule] = await Promise.all([
              yearClient.getLeagueInfo(),
              yearClient.getTeams(),
              yearClient.getSchedule()
            ]);

            const yearTransformedData = transformESPNData({
              leagueInfo: yearLeagueInfo,
              teams: yearTeams,
              schedule: yearSchedule,
              boxScores: []
            });

            if (yearTransformedData.schedule.length > 0) {
              console.log(`✓ ${year}: Found ${yearTransformedData.schedule.length} games`);
              allMatchups.push(...yearTransformedData.schedule);
              seasonsData.push({
                season: year,
                games: yearTransformedData.schedule.length,
                teams: yearTransformedData.teams.length
              });
            } else {
              console.log(`✗ ${year}: No games found`);
            }
            
            // Use the most recent season's teams for current team names
            if (year === season) {
              allTeams = yearTransformedData.teams;
            }
          } catch (yearError) {
            console.log(`✗ Failed to fetch ${year} data:`, yearError instanceof Error ? yearError.message : 'Unknown error');
          }
        }

        console.log(`📊 Total games collected: ${allMatchups.length} across ${seasonsData.length} seasons`);
        
        // Sort matchups by season and week for chronological order
        const completedMatchups = allMatchups.sort((a, b) => {
          if (a.season !== b.season) return a.season - b.season;
          return a.week - b.week;
        });
        
        // Calculate statistics using all historical data
        const leagueStats = calculateLeagueStats(allTeams, completedMatchups, []);
        const { StatsService } = await import('@/lib/stats-service');
        const rivalries = StatsService.calculateRivalries(allTeams, completedMatchups);
        const seasonSummary = StatsService.calculateSeasonSummary(season, allTeams, completedMatchups, []);
        const records = StatsService.findLeagueRecords(allTeams, completedMatchups, []);

        const response = {
          leagueInfo: {
            ...transformedData.leagueInfo,
            totalGamesAllTime: allMatchups.length,
            seasonsData: seasonsData,
            dataRange: `${startYear}-${season}`
          },
          teams: allTeams,
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