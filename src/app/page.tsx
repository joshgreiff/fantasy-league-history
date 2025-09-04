'use client';

import { useState, useEffect } from 'react';
import { Team, LeagueStats, LeagueHistory } from '@/types/fantasy';
import AllTimeStandings from '@/components/AllTimeStandings';
import LeagueRecords from '@/components/LeagueRecords';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Calendar, AlertCircle, Loader2 } from 'lucide-react';

interface LeagueData {
  leagueInfo: {
    name: string;
    season: number;
    totalTeams: number;
    totalWeeks: number;
  };
  teams: Team[];
  stats: {
    leagueStats: LeagueStats[];
    records: LeagueHistory['records'];
  };
}

export default function Home() {
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'standings' | 'records'>('standings');

  useEffect(() => {
    fetchLeagueData();
  }, []);

  const fetchLeagueData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/league');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch league data');
      }
      
      const data = await response.json();
      setLeagueData(data);
    } catch (err) {
      console.error('Error fetching league data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading League Data...</h2>
          <p className="text-gray-600 mt-2">Fetching your fantasy football history</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuration Required</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-yellow-800 mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Copy your ESPN_S2 cookie from ESPN Fantasy</li>
              <li>2. Copy your SWID cookie from ESPN Fantasy</li>
              <li>3. Get your League ID from the URL</li>
              <li>4. Update your .env.local file</li>
            </ol>
          </div>
          <button
            onClick={fetchLeagueData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!leagueData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">No Data Available</h2>
          <p className="text-gray-600 mt-2">Unable to load league information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                <span className="truncate">{leagueData.leagueInfo.name}</span>
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">League History Dashboard</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Season {leagueData.leagueInfo.season}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{leagueData.leagueInfo.totalTeams} Teams</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Teams</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-blue-600">{leagueData.leagueInfo.totalTeams}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Current Season</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-600">{leagueData.leagueInfo.season}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Weeks</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-purple-600">{leagueData.leagueInfo.totalWeeks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Games Played</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-orange-600">
                {leagueData.stats.leagueStats.reduce((sum, stat) => sum + stat.wins + stat.losses + stat.ties, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-1 sm:gap-0 mb-8">
          <button
            onClick={() => setActiveTab('standings')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              activeTab === 'standings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All-Time Standings
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            League Records
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'standings' && (
            <AllTimeStandings 
              teams={leagueData.teams} 
              stats={leagueData.stats.leagueStats} 
            />
          )}
          
          {activeTab === 'records' && (
            <LeagueRecords records={leagueData.stats.records} />
          )}
        </div>
      </div>
    </div>
  );
}
