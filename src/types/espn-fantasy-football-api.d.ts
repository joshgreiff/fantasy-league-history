declare module 'espn-fantasy-football-api' {
  export interface ClientOptions {
    leagueId: number;
    seasonId: number;
    espnS2?: string;
    swid?: string;
  }

  export interface ESPNTeam {
    id: number;
    name: string;
    abbrev: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    owners?: Array<{ displayName: string }>;
  }

  export interface ESPNMatchup {
    id: number;
    matchupPeriodId: number;
    playoffTierType?: string;
    home?: {
      teamId: number;
      totalPoints: number;
    };
    away?: {
      teamId: number;
      totalPoints: number;
    };
  }

  export interface ESPNPlayer {
    id: string;
    name: string;
    teamId: number;
    slotCategoryId: string;
    position: string;
    projectedStats?: {
      appliedTotal: number;
    };
    stats?: {
      appliedTotal: number;
    };
  }

  export interface ESPNBoxScore {
    id: number;
    homeRoster?: ESPNPlayer[];
    awayRoster?: ESPNPlayer[];
  }

  export interface ESPNDraftPick {
    roundId: number;
    pickOrder: number;
    teamId: number;
    playerId: string;
    playerName: string;
    playerPosition: string;
  }

  export interface ESPNDraft {
    draftDetail?: {
      picks: ESPNDraftPick[];
    };
  }

  export interface ESPNLeagueInfo {
    settings?: {
      name?: string;
      scheduleSettings?: {
        matchupPeriodCount: number;
      };
    };
  }

  export class Client {
    constructor(options: ClientOptions);
    
    getLeagueInfo(): Promise<ESPNLeagueInfo>;
    getTeamsAtWeek(options: { scoringPeriodId: number }): Promise<ESPNTeam[]>;
    getSchedule(): Promise<ESPNMatchup[]>;
    getBoxscoreForWeek(options: { matchupPeriodId: number }): Promise<ESPNBoxScore[]>;
    getDraftInfo(): Promise<ESPNDraft>;
  }
} 