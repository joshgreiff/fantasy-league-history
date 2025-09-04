'use client';

import { Team, LeagueStats } from '@/types/fantasy';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatRecord, formatScore, getWinPercentage, getRankSuffix } from '@/lib/utils';
import { Trophy, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface AllTimeStandingsProps {
  teams: Team[];
  stats: LeagueStats[];
}

export default function AllTimeStandings({ teams, stats }: AllTimeStandingsProps) {
  // Sort teams by win percentage, then by points for
  const sortedStats = stats
    .map(stat => {
      const team = teams.find(t => t.id === stat.teamId);
      const winPct = getWinPercentage(stat.wins, stat.losses, stat.ties);
      return { ...stat, team, winPct };
    })
    .filter(stat => stat.team)
    .sort((a, b) => {
      if (Math.abs(b.winPct - a.winPct) < 0.01) {
        return b.pointsFor - a.pointsFor;
      }
      return b.winPct - a.winPct;
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            All-Time Standings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Rank</th>
                  <th className="text-left py-2 px-3">Team</th>
                  <th className="text-left py-2 px-3">Record</th>
                  <th className="text-left py-2 px-3">Win %</th>
                  <th className="text-left py-2 px-3">PF</th>
                  <th className="text-left py-2 px-3">PA</th>
                  <th className="text-left py-2 px-3">Avg</th>
                  <th className="text-left py-2 px-3">High</th>
                  <th className="text-left py-2 px-3">Low</th>
                </tr>
              </thead>
              <tbody>
                {sortedStats.map((stat, index) => (
                  <tr key={stat.teamId} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <span className="font-medium">
                        {index + 1}{getRankSuffix(index + 1)}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div>
                        <div className="font-medium">{stat.team?.name}</div>
                        <div className="text-xs text-gray-500">{stat.team?.owner}</div>
                      </div>
                    </td>
                    <td className="py-2 px-3 font-mono">
                      {formatRecord(stat.wins, stat.losses, stat.ties)}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`font-medium ${
                        stat.winPct >= 60 ? 'text-green-600' :
                        stat.winPct >= 50 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {stat.winPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono">{formatScore(stat.pointsFor)}</td>
                    <td className="py-2 px-3 font-mono">{formatScore(stat.pointsAgainst)}</td>
                    <td className="py-2 px-3 font-mono">{formatScore(stat.averageScore)}</td>
                    <td className="py-2 px-3 font-mono text-green-600">{formatScore(stat.highestScore)}</td>
                    <td className="py-2 px-3 font-mono text-red-600">{formatScore(stat.lowestScore)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Longest Win Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedStats
                .sort((a, b) => b.longestWinStreak - a.longestWinStreak)
                .slice(0, 5)
                .map((stat, index) => (
                  <div key={stat.teamId} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{stat.team?.name}</div>
                      <div className="text-xs text-gray-500">{stat.team?.owner}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{stat.longestWinStreak}</div>
                      <div className="text-xs text-gray-500">games</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Biggest Blowouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedStats
                .sort((a, b) => b.biggestWin - a.biggestWin)
                .slice(0, 5)
                .map((stat, index) => (
                  <div key={stat.teamId} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{stat.team?.name}</div>
                      <div className="text-xs text-gray-500">{stat.team?.owner}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{formatScore(stat.biggestWin)}</div>
                      <div className="text-xs text-gray-500">margin</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-purple-500" />
              Points Left on Bench
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedStats
                .sort((a, b) => b.pointsLeftOnBench - a.pointsLeftOnBench)
                .slice(0, 5)
                .map((stat, index) => (
                  <div key={stat.teamId} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{stat.team?.name}</div>
                      <div className="text-xs text-gray-500">{stat.team?.owner}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">{formatScore(stat.pointsLeftOnBench)}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 