interface ESPNTeam {
  id: number;
  location: string;
  nickname: string;
  abbrev: string;
  owners: Array<{
    firstName: string;
    lastName: string;
  }>;
}

interface ESPNMatchup {
  id: number;
  matchupPeriodId: number;
  home: {
    teamId: number;
    totalPoints: number;
  };
  away: {
    teamId: number;
    totalPoints: number;
  };
  winner?: 'HOME' | 'AWAY';
}

interface ESPNLeagueInfo {
  settings: {
    name: string;
    size: number;
    scheduleSettings: {
      matchupPeriodCount: number;
    };
  };
  seasonId: number;
}

export class DirectESPNClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(
    private leagueId: number,
    private seasonId: number,
    private espnS2: string,
    private swid: string
  ) {
    this.baseUrl = `https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${leagueId}`;
    this.headers = {
      'Cookie': `espn_s2=${espnS2}; SWID=${swid}`,
      'Accept': 'application/json',
    };
  }

  private async makeRequest(endpoint: string, params: Record<string, unknown> = {}) {
    const url = new URL(this.baseUrl + endpoint);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    console.log(`Making ESPN API request to: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`ESPN API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getLeagueInfo(): Promise<ESPNLeagueInfo> {
    const data = await this.makeRequest('');
    return data;
  }

  async getTeams(): Promise<ESPNTeam[]> {
    const data = await this.makeRequest('', { view: 'mTeam' });
    console.log('ESPN Teams data sample:', JSON.stringify(data.teams?.[0], null, 2));
    return data.teams || [];
  }

  async getSchedule(weeks?: number[]): Promise<ESPNMatchup[]> {
    const params: Record<string, unknown> = { view: 'mMatchup' };
    
    if (weeks && weeks.length > 0) {
      params.scoringPeriodId = weeks.join(',');
    }

    const data = await this.makeRequest('', params);
    return data.schedule || [];
  }

  async getBoxScores(week: number): Promise<unknown[]> {
    const data = await this.makeRequest('', {
      view: 'mBoxscore',
      scoringPeriodId: week
    });
    
    return data.schedule?.map((matchup: unknown) => ({
      matchupId: (matchup as { id: unknown }).id,
      home: (matchup as { home: unknown }).home,
      away: (matchup as { away: unknown }).away
    })) || [];
  }
}

// Transform ESPN data to our format
export function transformESPNData(espnData: {
  leagueInfo: ESPNLeagueInfo;
  teams: ESPNTeam[];
  schedule: ESPNMatchup[];
  boxScores: unknown[];
}) {
  const { leagueInfo, teams, schedule } = espnData;

  // Transform teams
  const transformedTeams = teams.map(team => ({
    id: team.id,
    name: `${team.location || ''} ${team.nickname || ''}`.trim() || `Team ${team.id}`,
    owner: team.owners?.[0] ? `${team.owners[0].firstName || ''} ${team.owners[0].lastName || ''}`.trim() : 'Unknown',
    abbreviation: team.abbrev || team.nickname?.substring(0, 3).toUpperCase() || `T${team.id}`
  }));

  // Transform schedule - only include completed matchups with scores
  const transformedSchedule = schedule
    .filter(matchup => matchup.home && matchup.away)
    .map(matchup => {
      const homeTeam = transformedTeams.find(t => t.id === matchup.home.teamId);
      const awayTeam = transformedTeams.find(t => t.id === matchup.away.teamId);
      
      if (!homeTeam || !awayTeam) return null;

      const homeScore = matchup.home.totalPoints || 0;
      const awayScore = matchup.away.totalPoints || 0;
      
      // Only include completed matchups (with scores > 0)
      if (homeScore === 0 && awayScore === 0) return null;
      
      const winner = homeScore > awayScore ? homeTeam : awayTeam;

      return {
        id: `${leagueInfo.seasonId}-${matchup.matchupPeriodId}-${matchup.id}`,
        season: leagueInfo.seasonId,
        week: matchup.matchupPeriodId,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        winner,
        isPlayoff: matchup.matchupPeriodId > (leagueInfo.settings?.scheduleSettings?.matchupPeriodCount || 14),
        isSemifinal: false,
        isFinal: false
      };
    })
    .filter((matchup): matchup is NonNullable<typeof matchup> => matchup !== null);

  return {
    leagueInfo: {
      name: leagueInfo.settings?.name || 'Fantasy League',
      season: leagueInfo.seasonId,
      totalTeams: leagueInfo.settings?.size || teams.length,
      totalWeeks: leagueInfo.settings?.scheduleSettings?.matchupPeriodCount || 17
    },
    teams: transformedTeams,
    schedule: transformedSchedule,
    boxScores: [] // We'll implement this if needed
  };
} 